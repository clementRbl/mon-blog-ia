import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    const { articleTitle, commentAuthor, commentContent } = body

    // Récupérer l'URL de base
    const baseUrl = config.public.siteUrl || 'https://clementreboul.netlify.app'

    // Payload pour la notification push
    const payload = {
      title: '💬 Nouveau commentaire !',
      body: `${commentAuthor || 'Anonyme'} sur "${articleTitle}"`,
      icon: `${baseUrl}/icon-192x192.png`,
      badge: `${baseUrl}/icon-192x192.png`,
      tag: 'new-comment',
      requireInteraction: false,
      data: {
        url: `${baseUrl}/admin/comments`,
        type: 'new-comment',
        timestamp: Date.now()
      }
    }

    // Récupérer toutes les subscriptions
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey || config.public.supabaseAnonKey
    )

    // Récupérer l'email admin depuis les variables d'environnement
    const adminEmail = config.adminEmail
    
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL non configuré, notifications désactivées')
      return { success: true, sent: 0 }
    }

    // Filtrer uniquement les subscriptions de l'admin
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('enabled', true)
      .eq('user_email', adminEmail)

    if (error) {
      console.error('Erreur récupération subscriptions:', error)
      return { success: false, error: 'Erreur récupération subscriptions' }
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`Aucune subscription active pour l'admin (${adminEmail})`)
      return { success: true, sent: 0 }
    }

    // Envoyer les notifications
    // Configuration web-push
    if (!config.public.vapidPublicKey || !config.vapidPrivateKey) {
      console.error('VAPID keys manquantes')
      return { success: false, error: 'Configuration VAPID manquante' }
    }

    webpush.setVapidDetails(
      'mailto:clement@example.com', // Remplace par ton email
      config.public.vapidPublicKey,
      config.vapidPrivateKey
    )

    let sent = 0
    let failed = 0

    for (const subscription of subscriptions) {
      try {
        // Construire l'objet subscription au bon format
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }
        
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload)
        )
        sent++
      } catch (error: any) {
        console.error(`Erreur envoi notification pour ${subscription.id}:`, error)
        
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
    return { success: true, sent, failed }

  } catch (error) {
    console.error('Erreur serveur:', error)
    return { success: false, error: String(error) }
  }
})
