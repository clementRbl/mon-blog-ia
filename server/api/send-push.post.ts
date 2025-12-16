import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Configuration Web Push
  webpush.setVapidDetails(
    'mailto:clement@example.com', // Remplace par ton email
    config.public.vapidPublicKey,
    config.vapidPrivateKey
  )

  // Récupérer le body de la requête
  const body = await readBody(event)
  const { title, message, url } = body

  // Vérification : cette API ne doit être appelée que depuis le serveur (SSR)
  // En production, ajoute une vérification d'authentification plus robuste
  const origin = getRequestHeader(event, 'origin')
  const host = getRequestHeader(event, 'host')
  
  // Autoriser uniquement les requêtes locales (dev) ou depuis ton domaine (prod)
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1')
  const isYourDomain = origin?.includes('clementreboul.netlify.app')
  
  if (!isLocalhost && !isYourDomain) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès refusé'
    })
  }

  // Connexion à Supabase (pooling réutilisé)
  const supabase = getSupabaseServiceClient()

  // Récupérer toutes les souscriptions
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des souscriptions'
    })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return { success: true, sent: 0, message: 'Aucun abonné' }
  }

  // Payload de la notification
  const payload = JSON.stringify({
    title: title || 'Nouvel article sur le blog',
    body: message || 'Un nouvel article vient d\'être publié !',
    icon: '/mon-blog-ia/images/logo.png',
    badge: '/mon-blog-ia/images/logo.png',
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

  return {
    success: true,
    sent: successCount,
    failed: failedEndpoints.length,
    total: subscriptions.length
  }
})
