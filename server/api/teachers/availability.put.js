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

    // Seuls les professeurs peuvent modifier leurs disponibilités
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    const body = await readBody(event);
    const { availability } = body;

    // Validation des données
    if (!Array.isArray(availability)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Les disponibilités doivent être un tableau'
      });
    }

    // Valider chaque créneau
    for (const slot of availability) {
      if (typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Jour de la semaine invalide (0-6)'
        });
      }

      if (!slot.startTime || !slot.endTime) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Heures de début et fin requises'
        });
      }

      // Valider le format des heures (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Format d\'heure invalide (HH:MM)'
        });
      }

      // Vérifier que l'heure de fin est après l'heure de début
      if (slot.startTime >= slot.endTime) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'L\'heure de fin doit être après l\'heure de début'
        });
      }
    }

    // Mettre à jour les disponibilités du professeur
    const teacher = await Teacher.findOneAndUpdate(
      { userId: new ObjectId(auth.user._id) },
      { 
        $set: { 
          availability: availability,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!teacher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Profil professeur non trouvé'
      });
    }

    console.log(`Disponibilités mises à jour pour le professeur ${teacher._id}`);

    return {
      availability: teacher.availability,
      message: 'Disponibilités mises à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des disponibilités:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la mise à jour des disponibilités'
    });
  }
});
