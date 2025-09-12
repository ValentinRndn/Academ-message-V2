import Booking from '../../models/Booking.js';
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

    // Seuls les professeurs peuvent envoyer des rappels
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    const body = await readBody(event);
    const { bookingId, reminderType = 'hour' } = body;

    if (!ObjectId.isValid(bookingId)) {
      throw createError({
        statusCode: 400,
        message: 'ID de réservation invalide'
      });
    }

    // Vérifier que la réservation appartient au professeur
    const booking = await Booking.findOne({
      _id: new ObjectId(bookingId),
      teacherId: new ObjectId(auth.user._id),
      status: { $in: ['confirmed', 'pending'] }
    });

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: 'Réservation non trouvée ou non autorisée'
      });
    }

    // Calculer le temps avant le cours
    const now = new Date();
    const courseTime = new Date(booking.startTime);
    const timeDiff = courseTime - now;
    const hoursBefore = Math.floor(timeDiff / (1000 * 60 * 60));

    // Vérifier que le cours est dans le futur
    if (timeDiff <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Impossible d\'envoyer un rappel pour un cours passé'
      });
    }

    // Créer le rappel
    const reminder = {
      bookingId: new ObjectId(bookingId),
      teacherId: new ObjectId(auth.user._id),
      studentId: booking.studentId,
      type: reminderType,
      scheduledFor: courseTime,
      message: `Rappel : Votre cours de ${booking.subject} commence dans ${hoursBefore} heure(s)`,
      status: 'pending',
      createdAt: new Date()
    };

    // TODO: Intégrer avec un système de notifications push ou email
    console.log('Rappel créé:', reminder);

    return {
      message: 'Rappel programmé avec succès',
      reminder: {
        ...reminder,
        _id: new ObjectId(), // Simuler un ID
        bookingId: bookingId
      }
    };

  } catch (error) {
    console.error('Erreur lors de la création du rappel:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la création du rappel'
    });
  }
});
