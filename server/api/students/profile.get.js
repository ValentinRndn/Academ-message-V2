import { connectToDatabase } from '../../config/database.js';
import { findUsers } from '../../models/userModel.js';

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

    // Seuls les étudiants peuvent accéder à cette API
    if (auth.user.role !== 'student') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux étudiants'
      });
    }

    // Récupérer le profil de l'étudiant
    const students = await findUsers({ _id: auth.user._id });
    const student = students[0];
    
    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil étudiant non trouvé'
      });
    }

    // Structurer les données du profil
    const profile = {
      _id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      avatar: student.avatar || '',
      educationLevel: student.educationLevel || '',
      subjectsOfInterest: student.subjectsOfInterest || [],
      learningGoals: student.learningGoals || '',
      preferredTimeSlots: student.preferredTimeSlots || [],
      status: student.status || 'active',
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    };

    return {
      success: true,
      profile
    };

  } catch (error) {
    console.error('Erreur lors de la récupération du profil étudiant:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération du profil étudiant'
    });
  }
});
