// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
        }
      ]
    }
  },
  
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    // Variables privées côté serveur uniquement
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    
    // Configuration Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    
    // Configuration SMTP
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    baseUrl: process.env.BASE_URL,
    
    public: {
      // Variables publiques accessibles côté client
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    }
  },
  appConfig: {
    buildAssetsDir: '/_nuxt/'
  },
  // Configuration Vite pour résoudre le problème de chemin
  vite: {
    server: {
      port: 3000,
      allowedHosts: ['academ.my', 'localhost', '127.0.0.1'], // Ajoutez cette ligne
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
        origin: ['http://localhost:3000', 'http://localhost:3001', 'https://academ.my'], // Ajoutez aussi academ.my ici
        credentials: true
      }
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
    },

    // Configuration du serveur
    serverDir: './server'
  }
})