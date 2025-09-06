// Middleware d'authentification pour Nuxt
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { findUserById } from '../models/userModel.js';

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
export default defineEventHandler(async (event) => {
  // Exclure les routes publiques
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/me',
    '/api/auth/logout',
    '/api/auth/check-token',
    '/api/teachers', // Liste publique des professeurs
    '/api/subjects', // Liste publique des matières
  ];

  // Routes qui nécessitent une authentification (messages, profils, etc.)
  const protectedRoutes = [
    '/api/messages', // Toutes les routes de messages nécessitent une auth
    '/api/teachers/my-profile', // Profil du professeur connecté
    '/api/admin', // Toutes les routes admin nécessitent une auth
  ];

  // Routes publiques avec paramètres dynamiques
  const publicRoutePatterns = [
    /^\/api\/teachers\/[0-9a-fA-F]{24}$/, // /api/teachers/[objectId] - détail d'un professeur (public)
  ];
  
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.includes(event.path) || 
                       publicRoutePatterns.some(pattern => pattern.test(event.path));
  
  // Vérifier si la route nécessite une authentification
  const needsAuth = event.path.startsWith('/api/') && !isPublicRoute;
  
  if (!needsAuth) {
    return;
  }
  
  // Vérifier le token pour les routes API
  if (event.path.startsWith('/api/')) {
    const token = getCookie(event, 'auth_token');
    
    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Token invalide ou expiré'
      });
    }
    
    // Vérifier si l'utilisateur existe toujours
    const user = await findUserById(decoded.userId);
    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier si le compte est actif
    if (user.status !== 'active') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Votre compte est désactivé'
      });
    }
    
    // Ajouter les informations de l'utilisateur au contexte
    event.context.auth = {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      token
    };
  }
});