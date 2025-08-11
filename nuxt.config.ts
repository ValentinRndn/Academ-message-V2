// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      allowedHosts: ['https://524e7f1539c3.ngrok-free.app']
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
        origin: ['https://524e7f1539c3.ngrok-free.app', 'http://localhost:3000', 'http://localhost:3001'],
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
    devProxy: {
      '/api': {
        target: 'https://524e7f1539c3.ngrok-free.app',
        changeOrigin: true
      }
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      }
    },
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
    }
  }
})