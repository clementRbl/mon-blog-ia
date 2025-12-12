export const usePushNotifications = () => {
  const { supabase } = useSupabase()
  const config = useRuntimeConfig()
  
  // Vérifier si les notifications push sont supportées
  const isSupported = computed(() => {
    return process.client && 'serviceWorker' in navigator && 'PushManager' in window
  })
  
  // Vérifier l'état de la permission
  const permissionState = ref<NotificationPermission>('default')
  
  if (process.client && typeof Notification !== 'undefined') {
    permissionState.value = Notification.permission
  }
  
  // Convertir une clé base64 en Uint8Array pour VAPID
  const urlBase64ToUint8Array = (base64String: string) => {
    if (!base64String) {
      throw new Error('Clé VAPID manquante')
    }
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  
  // S'abonner aux notifications push
  const subscribe = async () => {
    if (!isSupported.value || typeof Notification === 'undefined') {
      throw new Error('Les notifications push ne sont pas supportées')
    }
    
    try {
      // Vérifier que la clé VAPID est configurée
      if (!config.public.vapidPublicKey) {
        throw new Error('Clé VAPID publique non configurée')
      }
      
      // Demander la permission
      const permission = await Notification.requestPermission()
      permissionState.value = permission
      
      if (permission !== 'granted') {
        throw new Error('Permission refusée')
      }
      
      // Récupérer le service worker
      const registration = await navigator.serviceWorker.ready
      
      // S'abonner avec les clés VAPID
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey)
      })
      
      // Sauvegarder la subscription via l'endpoint sécurisé
      // L'email sera automatiquement récupéré côté serveur depuis la session auth
      const subscriptionData = subscription.toJSON()
      
      const response = await $fetch('/api/push-subscribe', {
        method: 'POST',
        body: {
          endpoint: subscriptionData.endpoint,
          p256dh: subscriptionData.keys?.p256dh || '',
          auth: subscriptionData.keys?.auth || ''
        },
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
        }
      })
      
      if (!response.success) {
        throw new Error('Erreur sauvegarde subscription')
      }
      
      return subscription
    } catch (error) {
      console.error('Erreur lors de l\'abonnement push:', error)
      throw error
    }
  }
  
  // Se désabonner
  const unsubscribe = async () => {
    if (!isSupported.value) return
    
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        // Supprimer de Supabase
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint)
        
        // Se désabonner
        await subscription.unsubscribe()
        permissionState.value = 'default'
      }
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error)
      throw error
    }
  }
  
  // Vérifier si déjà abonné
  const isSubscribed = async () => {
    if (!isSupported.value) return false
    
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return subscription !== null
    } catch {
      return false
    }
  }
  
  return {
    isSupported,
    permissionState,
    subscribe,
    unsubscribe,
    isSubscribed
  }
}
