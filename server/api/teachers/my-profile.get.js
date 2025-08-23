import Teacher from '../../models/Teacher.js';
import { connectToDatabase } from '../../config/database.js';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est authentifié et est un professeur
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    // Vérifier que l'utilisateur est un professeur
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    // Chercher le profil Teacher correspondant à cet utilisateur
    const teacherProfile = await Teacher.findOne({ userId: auth.user._id })
      .populate('subjects');

    if (!teacherProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil professeur non trouvé'
      });
    }

    // Ajouter la propriété isAvailableNow
    const teacherObj = teacherProfile.toObject();
    teacherObj.isAvailableNow = teacherProfile.isAvailableNow();

    return {
      teacher: teacherObj
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du profil professeur:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération du profil professeur'
    });
  }
});
