// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      
    }
  },
  appConfig: {
    buildAssetsDir: '/_nuxt/'
  },
  // Configuration Vite pour résoudre le problème de chemin
  vite: {
    server: {
      fs: {
        // Autoriser explicitement les chemins qui posent problème
        allow: [
          // Répertoire actuel et parent
          '.',
          '..',
          // Chemin problématique explicite
          'C:/Users/Admin/Documents/Academ-message-pwa/node_modules/nuxt/dist/app/entry.js',
          // Répertoire du projet actuel
          'C:/Users/Admin/Documents/Academ-message-V2'
        ]
      },
      cors: {
        origin: ['http://localhost:3001'],
        credentials: true
      }
    }
  },
  // Désactiver le PWA pour le moment pour simplifier le debugging
  pwa: {
    devOptions: {
      enabled: false
    }
  },
  // Paramètres expérimentaux à ajuster
  experimental: {
    // Désactiver certaines fonctionnalités expérimentales qui pourraient causer des problèmes
    payloadExtraction: false,
    renderJsonPayloads: false,
    viewTransition: false,
    componentIslands: false
  },
  // Rétrograder les dépendances problématiques au runtime
  nitro: {
    esbuild: {
      options: {
        target: 'es2019' // Cible plus compatible
      }
    },

    routeRules: {
      '/api/**': {
        cors: true
      }
    }
  }
})