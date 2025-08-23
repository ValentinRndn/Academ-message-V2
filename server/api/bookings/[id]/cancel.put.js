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

    // Récupérer l'ID de la réservation depuis l'URL
    const bookingId = event.context.params.id;
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de réservation requis'
      });
    }

    // Vérifier que la réservation existe
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est autorisé à annuler cette réservation
    const isStudent = auth.user.role === 'student' && booking.studentId.toString() === auth.user._id;
    const isTeacher = auth.user.role === 'teacher' && booking.teacherId.toString() === auth.user._id;
    
    if (!isStudent && !isTeacher) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Vous n\'êtes pas autorisé à annuler cette réservation'
      });
    }

    // Vérifier que la réservation peut être annulée
    if (booking.status === 'cancelled') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cette réservation est déjà annulée'
      });
    }

    if (booking.status === 'completed') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Impossible d\'annuler un cours déjà terminé'
      });
    }

    // Vérifier que le cours n'a pas encore commencé (pour les étudiants)
    if (isStudent) {
      const now = new Date();
      const courseStart = new Date(booking.startTime);
      
      // Permettre l'annulation jusqu'à 2 heures avant le cours
      const twoHoursBefore = new Date(courseStart.getTime() - 2 * 60 * 60 * 1000);
      
      if (now > twoHoursBefore) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Impossible d\'annuler un cours moins de 2 heures avant le début'
        });
      }
    }

    // Annuler la réservation
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = auth.user._id;
    booking.cancellationReason = isStudent ? 'Annulé par l\'étudiant' : 'Annulé par l\'enseignant';
    
    await booking.save();

    // Retourner la réservation mise à jour
    const updatedBooking = await Booking.findById(bookingId)
      .populate('teacherId', 'firstName lastName email')
      .populate('studentId', 'firstName lastName email')
      .populate('subjectId', 'name');

    // Envoyer des notifications (en arrière-plan)
    try {
      const { notifyBookingCancelled } = await import('../../../utils/notifications.js');
      const cancelledBy = auth.user.role === 'teacher' ? 'teacher' : 'student';
      notifyBookingCancelled(updatedBooking, updatedBooking.teacherId, updatedBooking.studentId, cancelledBy);
    } catch (notificationError) {
      console.error('Erreur lors de l\'envoi de notification:', notificationError);
    }

    return {
      booking: updatedBooking,
      message: 'Réservation annulée avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l\'annulation de la réservation'
    });
  }
});
