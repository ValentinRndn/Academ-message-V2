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
        message: 'Authentication required'
      });
    }

    // Vérifier que l'utilisateur est un professeur
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Access restricted to teachers'
      });
    }

    // Chercher le profil Teacher correspondant à cet utilisateur
    const teacherProfile = await Teacher.findOne({ userId: auth.user._id })
      .populate('subjects');

    if (!teacherProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Teacher profile not found'
      });
    }

    // Ajouter la propriété isAvailableNow
    const teacherObj = teacherProfile.toObject();
    teacherObj.isAvailableNow = teacherProfile.isAvailableNow();

    return {
      teacher: teacherObj
    };
  } catch (error) {
    console.error('Error retrieving teacher profile:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Error retrieving teacher profile'
    });
  }
});
