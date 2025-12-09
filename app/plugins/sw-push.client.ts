// Plugin pour ajouter les gestionnaires de notifications push au Service Worker
export default defineNuxtPlugin(() => {
  if (!process.client) return
  
  // Détecter les in-app browsers qui ont des problèmes avec certaines APIs
  const ua = navigator.userAgent || ''
  const isInAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Messenger/i.test(ua)
  
  // Ne pas initialiser les push dans les in-app browsers
  if (isInAppBrowser) {
    return
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Service worker prêt pour les notifications push
      navigator.serviceWorker.controller?.postMessage({
        type: 'REGISTER_PUSH_HANDLERS'
      })
    })
  }
})
