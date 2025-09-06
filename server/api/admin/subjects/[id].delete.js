import { connectToMongoDB } from '../../../utils/mongodb.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const auth = event.context.auth;
    if (!auth || !auth.user || auth.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé'
      });
    }

    const subjectId = getRouterParam(event, 'id');

    // Validation des paramètres
    if (!ObjectId.isValid(subjectId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de matière invalide'
      });
    }

    const db = await connectToMongoDB();

    // Vérifier que la matière existe
    const existingSubject = await db.collection('subjects').findOne({
      _id: new ObjectId(subjectId)
    });

    if (!existingSubject) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Matière non trouvée'
      });
    }

    // Vérifier qu'aucun professeur n'utilise cette matière
    const teacherCount = await db.collection('teachers').countDocuments({
      subjects: new ObjectId(subjectId)
    });

    if (teacherCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: `Impossible de supprimer cette matière car ${teacherCount} professeur${teacherCount > 1 ? 's' : ''} l'utilise${teacherCount > 1 ? 'nt' : ''}`
      });
    }

    // Vérifier qu'aucune réservation n'utilise cette matière
    const bookingCount = await db.collection('bookings').countDocuments({
      subjectId: new ObjectId(subjectId)
    });

    if (bookingCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: `Impossible de supprimer cette matière car ${bookingCount} réservation${bookingCount > 1 ? 's' : ''} l'utilise${bookingCount > 1 ? 'nt' : ''}`
      });
    }

    // Supprimer la matière
    const result = await db.collection('subjects').deleteOne({
      _id: new ObjectId(subjectId)
    });

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Matière non trouvée'
      });
    }

    console.log(`Matière supprimée: ${existingSubject.name} (ID: ${subjectId})`);

    return {
      success: true,
      message: 'Matière supprimée avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de la suppression de la matière:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la suppression de la matière'
    });
  }
});