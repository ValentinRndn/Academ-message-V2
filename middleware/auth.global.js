// Middleware global d'authentification côté client
export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas exécuter côté serveur
  if (process.server) return;
  
  // Liste des routes publiques (pas besoin d'authentification)
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/teachers', '/privacy-policy', '/terms-of-service', '/refund-policy'];
  if (publicRoutes.includes(to.path)) {
    return;
  }
  
  // Vérifier l'authentification
  try {
    const auth = useAuth();
    console.log('🔒 Middleware auth - Route:', to.path, 'Authenticated:', auth.isAuthenticated.value);
    
    // Si l'utilisateur n'est pas authentifié, initialiser l'authentification
    if (!auth.isAuthenticated.value) {
      console.log('🔒 Initialisation auth nécessaire pour', to.path);
      const authResult = await auth.initAuth();
      console.log('🔒 Résultat initAuth:', authResult);
      
      // Rediriger vers la page de connexion si l'authentification échoue
      if (!authResult) {
        console.log('🔒 Redirection vers /login depuis', to.path);
        return navigateTo('/login', { 
          replace: true,
          query: { redirect: to.fullPath }
        });
      }
    }
    
    console.log('🔒 Middleware auth - Accès autorisé à', to.path);
  } catch (error) {
    console.error('❌ Erreur dans le middleware d\'authentification:', error);
    console.log('🔒 Redirection vers /login à cause d\'une erreur');
    return navigateTo('/login', { 
      replace: true,
      query: { redirect: to.fullPath }
    });
  }
});