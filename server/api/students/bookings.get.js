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

    // Seuls les étudiants peuvent accéder à cette API
    if (auth.user.role !== 'student') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux étudiants'
      });
    }

    const query = getQuery(event);
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      timeFilter 
    } = query;

    // Construire le filtre de base
    let filter = { studentId: new ObjectId(auth.user._id) };

    // Filtre par statut
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filtre par temps
    if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      
      switch (timeFilter) {
        case 'upcoming':
          filter.startTime = { $gt: now };
          break;
        case 'past':
          filter.startTime = { $lt: now };
          break;
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filter.startTime = { $gte: today, $lt: tomorrow };
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          filter.startTime = { $gte: now, $lte: weekFromNow };
          break;
      }
    }

    // Calculer le skip pour la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les réservations avec pagination
    const bookings = await Booking.find(filter)
      .populate('teacherId', 'firstName lastName email avatar')
      .populate('subjectId', 'name description')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total pour la pagination
    const totalBookings = await Booking.countDocuments(filter);

    // Calculer les statistiques
    const stats = await calculateStudentStats(auth.user._id);

    // Vérifier si les cours terminés ont des avis
    const bookingsWithReviewStatus = await Promise.all(
      bookings.map(async (booking) => {
        const bookingObj = booking.toObject();
        
        // Vérifier si l'étudiant a laissé un avis pour ce cours
        if (booking.status === 'completed') {
          const review = await Booking.model('Review').findOne({
            bookingId: booking._id,
            studentId: auth.user._id
          });
          bookingObj.hasReview = !!review;
        }
        
        return bookingObj;
      })
    );

    return {
      bookings: bookingsWithReviewStatus,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBookings / parseInt(limit)),
        totalItems: totalBookings,
        itemsPerPage: parseInt(limit)
      }
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations étudiant:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des réservations'
    });
  }
});

// Fonction pour calculer les statistiques de l'étudiant
async function calculateStudentStats(studentId) {
  const [
    totalBookings,
    completedBookings,
    totalHours,
    averageRating
  ] = await Promise.all([
    // Total des réservations
    Booking.countDocuments({ studentId: new ObjectId(studentId) }),
    
    // Réservations terminées
    Booking.countDocuments({ 
      studentId: new ObjectId(studentId), 
      status: 'completed' 
    }),
    
    // Total des heures de cours
    Booking.aggregate([
      { $match: { 
        studentId: new ObjectId(studentId), 
        status: 'completed' 
      }},
      { $group: { 
        _id: null, 
        totalHours: { $sum: { $ifNull: ['$duration', 1] } } 
      }}
    ]).then(result => result[0]?.totalHours || 0),
    
    // Note moyenne (depuis les avis)
    Booking.model('Review').aggregate([
      { $match: { studentId: new ObjectId(studentId) }},
      { $group: { 
        _id: null, 
        averageRating: { $avg: '$rating' } 
      }}
    ]).then(result => result[0]?.averageRating || 0)
  ]);

  return {
    totalBookings,
    completedBookings,
    totalHours,
    averageRating: parseFloat(averageRating.toFixed(1))
  };
}
