export default defineNuxtPlugin(() => {
  // Enregistrer le service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration.scope)
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du Service Worker:', error)
        })
    })
  }
  
  // Gérer l'installation de la PWA
  let deferredPrompt
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique du prompt d'installation
    e.preventDefault()
    // Stocker l'événement pour l'utiliser plus tard
    deferredPrompt = e
    
    // Vous pouvez ici afficher un bouton d'installation personnalisé
    console.log('PWA prête à être installée')
  })
  
  // Écouter l'installation de la PWA
  window.addEventListener('appinstalled', () => {
    console.log('PWA installée avec succès')
    deferredPrompt = null
  })
})
