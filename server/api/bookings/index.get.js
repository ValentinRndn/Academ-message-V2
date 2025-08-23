import Booking from '../../models/Booking.js';
import { connectToDatabase } from '../../config/database.js';
import { connectToMongoDB } from '../../utils/mongodb.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    const db = await connectToMongoDB();
    
    // Vérifier que l'utilisateur est authentifié
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    const query = getQuery(event);
    const {
      status,
      paymentStatus,
      limit = 20,
      page = 1,
      sortBy = 'startTime',
      sortOrder = 'desc'
    } = query;

    const userId = new ObjectId(auth.user._id);
    const userRole = auth.user.role;

    // Construire le filtre de base selon le rôle
    let filter = {};
    if (userRole === 'teacher') {
      filter.teacherId = userId;
    } else if (userRole === 'student') {
      filter.studentId = userId;
    } else {
      // Les admins peuvent voir toutes les réservations
      // Pas de filtre supplémentaire
    }

    // Filtres optionnels
    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Paramètres de pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construire le tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Récupérer les réservations avec pagination
    const bookings = await Booking.find(filter)
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
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Compter le total pour la pagination
    const totalCount = await Booking.countDocuments(filter);

    // Ajouter les propriétés virtuelles calculées
    const bookingsWithVirtuals = bookings.map(booking => {
      const now = new Date();
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      
      return {
        ...booking,
        isPast: now > endTime,
        isOngoing: now >= startTime && now <= endTime,
        canBeCancelled: (() => {
          const timeDiff = startTime.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          return hoursDiff > 24 && booking.status !== 'cancelled' && booking.status !== 'completed';
        })()
      };
    });

    return {
      bookings: bookingsWithVirtuals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        hasMore: skip + bookingsWithVirtuals.length < totalCount
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
