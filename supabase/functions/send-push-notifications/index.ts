import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import web-push pour Deno
import webpush from 'npm:web-push@3.6.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configuration VAPID
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const supabaseUrl = Deno.env.get('PROJECT_URL')
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('VAPID keys non configurées')
    }

    webpush.setVapidDetails(
      'mailto:contact@clementreboul.fr',
      vapidPublicKey,
      vapidPrivateKey
    )

    // Parse request body
    const { title, message, url } = await req.json()

    // Créer le client Supabase avec la clé service
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Récupérer toutes les souscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'Aucun abonné' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Payload de la notification
    const payload = JSON.stringify({
      title: title || 'Nouvel article publié !',
      body: message || 'Un nouvel article vient d\'être publié',
      icon: '/mon-blog-ia/images/logo.png',
      url: url || '/mon-blog-ia/',
      timestamp: Date.now()
    })

    // Envoyer à tous les abonnés
    let successCount = 0
    let failedEndpoints: string[] = []

    for (const sub of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }

        await webpush.sendNotification(pushSubscription, payload)
        successCount++

        // Mettre à jour last_notified_at
        await supabase
          .from('push_subscriptions')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', sub.id)

      } catch (error: any) {
        console.error('Erreur d\'envoi:', error)
        
        // Si l'endpoint n'est plus valide (410), le supprimer
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id)
          failedEndpoints.push(sub.endpoint)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failedEndpoints.length,
        total: subscriptions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
