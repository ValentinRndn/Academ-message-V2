const CACHE_NAME = 'academ-v1'
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json'
]

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert')
        return cache.addAll(urlsToCache)
      })
  )
})

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Ne pas mettre en cache les requêtes non-GET
            if (event.request.method !== 'GET') {
              return response
            }
            
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // En cas d'erreur réseau, retourner la page hors ligne
            if (event.request.destination === 'document') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue:', event)
  
  let notificationData = {
    title: 'Academ',
    body: 'Vous avez une nouvelle notification',
    icon: '/icon512_rounded.png',
    badge: '/icon512_rounded.png',
    data: {
      url: '/'
    }
  }
  
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data
      }
    } catch (error) {
      console.error('Erreur parsing notification data:', error)
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/icon512_rounded.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icon512_rounded.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Vérifier si une fenêtre est déjà ouverte
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Ouvrir une nouvelle fenêtre si aucune n'est ouverte
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('Notification fermée:', event)
})

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('Message reçu dans SW:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
