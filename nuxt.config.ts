// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  appConfig: {
    buildAssetsDir: '/_nuxt/'
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Academ Message',
      short_name: 'AcademMsg',
      description: 'Academic messaging application',
      theme_color: '#4F46E5',
      background_color: '#ffffff',
      icons: [
        {
          src: 'favicon.ico',
          sizes: '64x64',
          type: 'image/x-icon'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
