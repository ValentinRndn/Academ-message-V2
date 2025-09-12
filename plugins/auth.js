// Plugin d'authentification pour Nuxt
export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialiser l'authentification côté client uniquement
  if (process.client) {
    const { useAuth } = await import('~/composables/useAuth.js');
    const { initAuth } = useAuth();
    console.log('🔐 Initialisation de l\'authentification...');
    const isAuth = await initAuth();
    console.log('🔐 Résultat auth:', isAuth);
  }
  
  // Ajouter un intercepteur pour les requêtes API
  nuxtApp.hook('app:created', () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (resource, options = {}) => {
      // Cloner les options pour ne pas modifier l'objet original
      const customOptions = { ...options };
      
      // Vérifier si la requête est vers notre API
      if (typeof resource === 'string' && resource.startsWith('/api')) {
        // Ajouter les credentials pour envoyer les cookies
        customOptions.credentials = 'include';
      }
      
      return originalFetch(resource, customOptions);
    };
  });
});