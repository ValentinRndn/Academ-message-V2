// API de déconnexion
// Dans une architecture API sans état comme Nuxt, nous ne stockons pas de session côté serveur
// La déconnexion se fait en supprimant le token côté client
// Cette route est fournie pour des raisons de compatibilité et de journalisation

export default defineEventHandler(async (event) => {
  try {
    // Si nous avions des jetons d'actualisation ou des sessions côté serveur,
    // nous les invaliderions ici
    
    return {
      success: true,
      message: 'Déconnexion réussie'
    };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la déconnexion'
    });
  }
});
