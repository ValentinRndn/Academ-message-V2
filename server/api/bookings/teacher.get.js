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

    // Seuls les professeurs peuvent accéder à leurs réservations
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    // Récupérer les paramètres de requête
    const query = getQuery(event);
    const { status, limit = 50, page = 1 } = query;

    // Construire le filtre
    const filter = {
      teacherId: new ObjectId(auth.user._id)
    };

    // Ajouter le filtre de statut si spécifié
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Calculer la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les réservations avec les informations des étudiants et des matières
    const bookings = await Booking.find(filter)
      .populate('studentId', 'firstName lastName email')
      .populate('subjectId', 'name')
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Compter le total pour la pagination
    const total = await Booking.countDocuments(filter);

    // Formater les données pour le frontend
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      studentNotes: booking.studentNotes,
      teacherNotes: booking.teacherNotes,
      student: booking.studentId,
      subject: booking.subjectId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    return {
      bookings: formattedBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des réservations'
    });
  }
});
