// Middleware global d'authentification côté client
export default defineNuxtRouteMiddleware((to) => {
  // Ne pas exécuter côté serveur
  if (process.server) return;
  
  // Liste des routes publiques (pas besoin d'authentification)
  const publicRoutes = ['/', '/login', '/register'];
  if (publicRoutes.includes(to.path)) {
    return;
  }
  
  // Vérifier l'authentification
  const { isAuthenticated, initAuth } = useAuth();
  
  // Si l'utilisateur n'est pas authentifié, initialiser l'authentification
  if (!isAuthenticated.value) {
    const authResult = initAuth();
    
    // Rediriger vers la page de connexion si l'authentification échoue
    if (!authResult) {
      return navigateTo('/login', { 
        replace: true,
        query: { redirect: to.fullPath }
      });
    }
  }
});
