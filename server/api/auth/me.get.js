// API pour récupérer les informations de l'utilisateur connecté
import { findUserById } from '../../models/userModel.js';
import { verifyToken, extractTokenFromHeader } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  try {
    // Si l'utilisateur est déjà authentifié via le middleware
    if (event.context.auth && event.context.auth.user) {
      const user = await findUserById(event.context.auth.user._id);
      if (!user) {
        return createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Masquer le mot de passe dans la réponse
      const { password: _, ...safeUser } = user;
      
      return {
        user: safeUser,
        isAuthenticated: true
      };
    }
    
    // Sinon, vérifier le token manuellement
    const token = extractTokenFromHeader(event);
    
    if (!token) {
      return {
        isAuthenticated: false,
        message: 'Non authentifié'
      };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        isAuthenticated: false,
        message: 'Token invalide ou expiré'
      };
    }
    
    const user = await findUserById(decoded.userId);
    if (!user) {
      return {
        isAuthenticated: false,
        message: 'Utilisateur non trouvé'
      };
    }
    
    if (user.status !== 'active') {
      return {
        isAuthenticated: false,
        message: 'Votre compte est désactivé'
      };
    }
    
    // Masquer le mot de passe dans la réponse
    const { password: _, ...safeUser } = user;
    
    return {
      user: safeUser,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la vérification de l\'authentification'
    });
  }
});
