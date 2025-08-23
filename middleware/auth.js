export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas exécuter côté serveur
  if (process.server) return;
  
  // Liste des routes publiques (pas besoin d'authentification)
  const publicRoutes = ['/', '/login', '/register'];
  if (publicRoutes.includes(to.path)) {
    return;
  }
  
  // Vérifier l'authentification
  try {
    const auth = useAuth();
    
    // Si l'utilisateur n'est pas authentifié, initialiser l'authentification
    if (!auth.isAuthenticated.value) {
      const authResult = await auth.initAuth();
      
      // Rediriger vers la page de connexion si l'authentification échoue
      if (!authResult) {
        return navigateTo('/login', { 
          replace: true,
          query: { redirect: to.fullPath }
        });
      }
    }
  } catch (error) {
    console.warn('Erreur dans le middleware d\'authentification:', error);
    // En cas d'erreur, rediriger vers la page de connexion
    return navigateTo('/login', { 
      replace: true,
      query: { redirect: to.fullPath }
    });
  }
});
