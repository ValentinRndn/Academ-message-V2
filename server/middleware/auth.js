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
  ];
  
  if (publicRoutes.includes(event.path)) {
    return;
  }
  
  // Vérifier le token pour les routes API
  if (event.path.startsWith('/api/')) {
    const token = extractTokenFromHeader(event);
    
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