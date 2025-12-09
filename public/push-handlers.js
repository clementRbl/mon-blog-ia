// Gestionnaire de notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'Un nouvel article vient d\'être publié !',
      icon: '/mon-blog-ia/images/logo.png',
      data: {
        url: data.url || '/mon-blog-ia/'
      },
      tag: `blog-${data.timestamp || Date.now()}`,
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
      self.registration.showNotification(data.title || 'Nouvel article', options)
    )
  } catch (error) {
    // Erreur silencieuse
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/mon-blog-ia/'
  
  // Si l'utilisateur clique sur "Plus tard", juste fermer la notification
  if (event.action === 'later') {
    return
  }
  
  // Si l'utilisateur clique sur "Lire maintenant" ou sur la notification elle-même
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre du blog est déjà ouverte, l'utiliser
      for (const client of clientList) {
        if (client.url.includes('/mon-blog-ia') && 'focus' in client) {
          return client.focus().then(() => {
            if (client.navigate) {
              return client.navigate(url)
            }
          })
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
