import Booking from '../../../models/Booking.js';
import { connectToDatabase } from '../../../config/database.js';
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

    // Seuls les professeurs peuvent confirmer des réservations
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    const bookingId = getRouterParam(event, 'id');
    
    if (!ObjectId.isValid(bookingId)) {
      throw createError({
        statusCode: 400,
        message: 'ID de réservation invalide'
      });
    }

    // Vérifier que la réservation appartient au professeur
    const booking = await Booking.findOne({
      _id: new ObjectId(bookingId),
      teacherId: new ObjectId(auth.user._id)
    });

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que la réservation est en attente
    if (booking.status !== 'pending') {
      throw createError({
        statusCode: 400,
        message: 'Seules les réservations en attente peuvent être confirmées'
      });
    }

    // Confirmer la réservation
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: 'confirmed',
        updatedAt: new Date()
      },
      { new: true }
    ).populate('studentId teacherId subjectId');

    console.log(`Réservation ${bookingId} confirmée par le professeur ${auth.user._id}`);

    // Envoyer des notifications (en arrière-plan)
    try {
      const { notifyBookingConfirmed } = await import('../../../utils/notifications.js');
      notifyBookingConfirmed(updatedBooking, auth.user, updatedBooking.studentId);
    } catch (notificationError) {
      console.error('Erreur lors de l\'envoi de notification:', notificationError);
    }

    return {
      message: 'Réservation confirmée avec succès',
      booking: updatedBooking
    };

  } catch (error) {
    console.error('Erreur lors de la confirmation de la réservation:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la confirmation de la réservation'
    });
  }
});
