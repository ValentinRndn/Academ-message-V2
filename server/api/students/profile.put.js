import { connectToDatabase } from '../../config/database.js';
import { updateUser } from '../../models/userModel.js';

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

    // Seuls les étudiants peuvent modifier leur profil
    if (auth.user.role !== 'student') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux étudiants'
      });
    }

    // Récupérer les données du body
    const body = await readBody(event);
    
    // Champs modifiables par l'étudiant
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'avatar',
      'educationLevel',
      'subjectsOfInterest',
      'learningGoals',
      'preferredTimeSlots'
    ];

    // Construire l'objet de mise à jour avec seulement les champs autorisés
    const updateData = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Validation des données
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Format d\'email invalide'
        });
      }
    }

    if (updateData.educationLevel) {
      const validLevels = ['elementary', 'middle_school', 'high_school', 'bachelor', 'master', 'phd', 'other'];
      if (!validLevels.includes(updateData.educationLevel)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Niveau d\'études invalide'
        });
      }
    }

    if (updateData.preferredTimeSlots) {
      const validSlots = ['morning', 'afternoon', 'evening'];
      if (!Array.isArray(updateData.preferredTimeSlots) || 
          !updateData.preferredTimeSlots.every(slot => validSlots.includes(slot))) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Créneaux horaires invalides'
        });
      }
    }

    // Ajouter la date de mise à jour
    updateData.updatedAt = new Date();

    // Mettre à jour le profil
    const updatedProfile = await updateUser(auth.user._id, updateData);
    
    if (!updatedProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil étudiant non trouvé'
      });
    }

    // Structurer les données de réponse
    const profile = {
      _id: updatedProfile._id,
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      phone: updatedProfile.phone || '',
      avatar: updatedProfile.avatar || '',
      educationLevel: updatedProfile.educationLevel || '',
      subjectsOfInterest: updatedProfile.subjectsOfInterest || [],
      learningGoals: updatedProfile.learningGoals || '',
      preferredTimeSlots: updatedProfile.preferredTimeSlots || [],
      status: updatedProfile.status || 'active',
      createdAt: updatedProfile.createdAt,
      updatedAt: updatedProfile.updatedAt
    };

    return {
      success: true,
      profile,
      message: 'Profil mis à jour avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil étudiant:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la mise à jour du profil étudiant'
    });
  }
});
