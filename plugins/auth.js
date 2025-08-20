// Plugin d'authentification pour Nuxt
export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialiser l'authentification côté client uniquement
  if (process.client) {
    const { initAuth } = useAuth();
    await initAuth();
  }
  
  // Ajouter un intercepteur pour ajouter le token d'authentification aux requêtes
  nuxtApp.hook('app:created', () => {
    const { token } = useAuth();
    
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (resource, options = {}) => {
      // Cloner les options pour ne pas modifier l'objet original
      const customOptions = { ...options };
      
      // Vérifier si la requête est vers notre API
      if (typeof resource === 'string' && resource.startsWith('/api')) {
        // Ajouter le token d'authentification si disponible
        if (token.value) {
          customOptions.headers = {
            ...customOptions.headers,
            'Authorization': `Bearer ${token.value}`
          };
        }
      }
      
      return originalFetch(resource, customOptions);
    };
  });
});
