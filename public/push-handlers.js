// Gestionnaire de notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const payload = event.data.json()
    
    const options = {
      body: payload.body || 'Un nouvel article vient d\'être publié !',
      icon: payload.icon || '/mon-blog-ia/images/logo.png',
      data: {
        url: payload.url || 'https://clementrbl.github.io/mon-blog-ia/'
      },
      tag: `blog-${payload.timestamp || Date.now()}`,
      requireInteraction: false,
      actions: [
        {
          action: 'read',
          title: 'Lire maintenant'
        },
        {
          action: 'later',
          title: 'Plus tard'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(payload.title || 'Nouvel article', options)
    )
  } catch (error) {
    // Erreur silencieuse
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  // Récupérer l'URL depuis les données de la notification
  const notificationData = event.notification.data || {}
  const targetUrl = notificationData.url || 'https://clementrbl.github.io/mon-blog-ia/'
  
  console.log('Notification clicked, URL:', targetUrl)
  
  // Si l'utilisateur clique sur "Plus tard", juste fermer la notification
  if (event.action === 'later') {
    return
  }
  
  // Si l'utilisateur clique sur "Lire maintenant" ou sur la notification elle-même
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientList) => {
      // Si une fenêtre du blog est déjà ouverte, la focus et naviguer
      for (const client of clientList) {
        if (client.url.includes('/mon-blog-ia') && 'focus' in client) {
          return client.focus().then(() => client.navigate(targetUrl))
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre avec l'URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
