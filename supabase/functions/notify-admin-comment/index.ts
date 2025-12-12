import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
    // Configuration
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const supabaseUrl = Deno.env.get('PROJECT_URL')
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://clementRbl.github.io/mon-blog-ia'

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('VAPID keys non configurées')
    }

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL non configuré, notifications désactivées')
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'ADMIN_EMAIL non configuré' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    webpush.setVapidDetails(
      'mailto:contact@clementreboul.fr',
      vapidPublicKey,
      vapidPrivateKey
    )

    // Parse request body
    const { articleTitle, commentAuthor, commentContent } = await req.json()

    // Créer le client Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Récupérer uniquement les subscriptions de l'admin
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('enabled', true)
      .eq('user_email', adminEmail)

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`Aucune subscription active pour l'admin (${adminEmail})`)
      return new Response(
        JSON.stringify({ success: true, sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Préparer le payload de notification
    const payload = JSON.stringify({
      title: '💬 Nouveau commentaire !',
      body: `${commentAuthor || 'Anonyme'} sur "${articleTitle}"`,
      icon: `${siteUrl}/icon-192x192.png`,
      badge: `${siteUrl}/icon-192x192.png`,
      tag: 'new-comment',
      requireInteraction: false,
      data: {
        url: `${siteUrl}/admin/comments`,
        type: 'new-comment',
        timestamp: Date.now()
      }
    })

    // Envoyer les notifications
    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }

        await webpush.sendNotification(pushSubscription, payload)
        sent++
      } catch (error: any) {
        console.error(`Erreur envoi notification pour ${subscription.id}:`, error)
        errors.push(`${subscription.id}: ${error.message}`)
        
        // Si la subscription est expirée (410), la désactiver
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .update({ enabled: false })
            .eq('id', subscription.id)
        }
        
        failed++
      }
    }

    console.log(`Notifications envoyées: ${sent}, échouées: ${failed}`)
    
    return new Response(
      JSON.stringify({ success: true, sent, failed, errors: errors.length > 0 ? errors : undefined }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur serveur:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
