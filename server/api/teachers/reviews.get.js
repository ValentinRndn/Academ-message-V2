import Review from '../../models/Review.js';
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

    // Seuls les professeurs peuvent accéder à cette API
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    const query = getQuery(event);
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      search, 
      sort = 'date' 
    } = query;

    // Construire le filtre de base
    const filter = {
      teacherId: new ObjectId(auth.user._id)
    };

    // Ajouter le filtre par note
    if (rating && rating !== 'all') {
      filter.rating = parseInt(rating);
    }

    // Ajouter le filtre de recherche
    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: 'i' } },
        { 'student.firstName': { $regex: search, $options: 'i' } },
        { 'student.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    // Construire le tri
    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'student':
        sortOption = { 'student.firstName': 1, createdAt: -1 };
        break;
      case 'date':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Calculer le skip pour la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les avis avec pagination
    const reviews = await Review.find(filter)
      .populate('bookingId', 'subject startTime duration')
      .populate('studentId', 'firstName lastName')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total d'avis
    const total = await Review.countDocuments(filter);

    // Formater les avis pour l'affichage
    const formattedReviews = reviews.map(review => {
      const booking = review.bookingId;
      const student = review.studentId;
      
      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        tags: review.tags || [],
        createdAt: review.createdAt,
        reply: review.reply,
        replyDate: review.replyDate,
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        subject: booking ? booking.subject : 'Matière non spécifiée',
        courseDate: booking ? booking.startTime : review.createdAt,
        duration: booking ? booking.duration : 1
      };
    });

    // Calculer les statistiques
    const allReviews = await Review.find({ teacherId: new ObjectId(auth.user._id) });
    
    const stats = {
      totalReviews: allReviews.length,
      averageRating: allReviews.length > 0 
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0,
      fiveStars: allReviews.filter(r => r.rating === 5).length,
      withComments: allReviews.filter(r => r.comment && r.comment.trim() !== '').length
    };

    // Calculer la répartition des notes
    const ratingCounts = {};
    for (let i = 1; i <= 5; i++) {
      ratingCounts[i] = allReviews.filter(r => r.rating === i).length;
    }

    const ratingDistribution = [1, 2, 3, 4, 5].map(stars => {
      const count = ratingCounts[stars] || 0;
      const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
      
      return {
        stars,
        count,
        percentage: Math.round(percentage)
      };
    });

    return {
      reviews: formattedReviews,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      stats,
      ratingDistribution
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des avis'
    });
  }
});
