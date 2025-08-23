import Booking from '../../models/Booking.js';
import { connectToDatabase } from '../../config/database.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
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

    const bookingId = getRouterParam(event, 'id');

    // Validation de l'ID
    if (!ObjectId.isValid(bookingId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de réservation invalide'
      });
    }

    // Récupérer la réservation avec les informations populées
    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'teacherId',
        select: 'firstName lastName email avatar'
      })
      .populate({
        path: 'studentId',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'subjectId',
        select: 'name'
      })
      .lean();

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Réservation non trouvée'
      });
    }

    const userId = auth.user._id;
    const userRole = auth.user.role;

    // Vérifier que l'utilisateur a accès à cette réservation
    const hasAccess = 
      (userRole === 'student' && booking.studentId._id.toString() === userId.toString()) ||
      (userRole === 'teacher' && booking.teacherId._id.toString() === userId.toString()) ||
      userRole === 'admin';

    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé à cette réservation'
      });
    }

    // Ajouter les propriétés virtuelles calculées
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    
    const bookingWithVirtuals = {
      ...booking,
      isPast: now > endTime,
      isOngoing: now >= startTime && now <= endTime,
      canBeCancelled: (() => {
        const timeDiff = startTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff > 24 && booking.status !== 'cancelled' && booking.status !== 'completed';
      })()
    };

    return {
      booking: bookingWithVirtuals
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération de la réservation'
    });
  }
});
