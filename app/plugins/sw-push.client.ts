// Plugin pour ajouter les gestionnaires de notifications push au Service Worker
export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Service worker prêt pour les notifications push
      navigator.serviceWorker.controller?.postMessage({
        type: 'REGISTER_PUSH_HANDLERS'
      })
    })
  }
})
