// API pour récupérer tous les utilisateurs (route protégée)
import { findUsers } from '../../models/userModel.js';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await findUsers();
    
    // Masquer les mots de passe dans la réponse
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    return {
      data: {
        users: safeUsers,
        count: safeUsers.length
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});
