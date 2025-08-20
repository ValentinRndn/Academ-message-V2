// API pour vérifier l'état du token (expiration, validité)
import { checkTokenExpiry, extractTokenFromHeader } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  try {
    const token = extractTokenFromHeader(event);
    
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        isExpiring: false,
        message: 'Aucun token fourni'
      };
    }
    
    const tokenStatus = checkTokenExpiry(token);
    
    return {
      isValid: !tokenStatus.isExpired,
      isExpired: tokenStatus.isExpired,
      isExpiring: tokenStatus.isExpiring,
      timeLeft: tokenStatus.timeLeft,
      message: tokenStatus.isExpired ? 'Token expiré' : 
               tokenStatus.isExpiring ? 'Token expire bientôt' : 'Token valide'
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return {
      isValid: false,
      isExpired: true,
      isExpiring: false,
      message: 'Erreur lors de la vérification'
    };
  }
});
