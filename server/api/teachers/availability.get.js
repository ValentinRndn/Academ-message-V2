import Teacher from '../../models/Teacher.js';
import { connectToDatabase } from '../../config/database.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est authentifié
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    // Seuls les professeurs peuvent accéder à leurs disponibilités
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    // Récupérer le professeur connecté
    const teacher = await Teacher.findOne({ userId: new ObjectId(auth.user._id) });
    
    if (!teacher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil professeur non trouvé'
      });
    }

    return {
      availability: teacher.availability || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des disponibilités'
    });
  }
});
