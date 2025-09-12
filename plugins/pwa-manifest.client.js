export default defineNuxtPlugin(() => {
  // Ajouter le lien vers le manifeste PWA
  const link = document.createElement('link')
  link.rel = 'manifest'
  link.href = '/manifest.json'
  document.head.appendChild(link)
  
  // Ajouter les meta tags pour PWA
  const metaTags = [
    { name: 'theme-color', content: '#8936FF' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'Academ' },
    { name: 'mobile-web-app-capable', content: 'yes' }
  ]
  
  metaTags.forEach(tag => {
    const meta = document.createElement('meta')
    meta.name = tag.name
    meta.content = tag.content
    document.head.appendChild(meta)
  })
  
  // Ajouter les liens pour les icônes Apple
  const appleIcons = [
    { sizes: '180x180', href: '/apple-touch-icon.png' },
    { sizes: '152x152', href: '/apple-touch-icon-152x152.png' },
    { sizes: '144x144', href: '/apple-touch-icon-144x144.png' },
    { sizes: '120x120', href: '/apple-touch-icon-120x120.png' },
    { sizes: '114x114', href: '/apple-touch-icon-114x114.png' },
    { sizes: '76x76', href: '/apple-touch-icon-76x76.png' },
    { sizes: '72x72', href: '/apple-touch-icon-72x72.png' },
    { sizes: '60x60', href: '/apple-touch-icon-60x60.png' },
    { sizes: '57x57', href: '/apple-touch-icon-57x57.png' }
  ]
  
  appleIcons.forEach(icon => {
    const link = document.createElement('link')
    link.rel = 'apple-touch-icon'
    link.sizes = icon.sizes
    link.href = icon.href
    document.head.appendChild(link)
  })
})
