// API pour récupérer les statistiques du dashboard selon le rôle
import { findUsers } from '../../models/userModel.js';
import { connectToMongoDB } from '../../utils/mongodb.js';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    if (!event.context.auth?.user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    const user = event.context.auth.user;
    const db = await connectToMongoDB();

    // Statistiques selon le rôle
    switch (user.role) {
      case 'admin':
        return await getAdminStats(db);
      case 'teacher':
        return await getTeacherStats(db, user._id);
      case 'student':
        return await getStudentStats(db, user._id);
      default:
        return createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'Rôle non autorisé'
        });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Statistiques pour l'administrateur
async function getAdminStats(db) {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalMessages,
    totalBookings,
    totalSubjects,
    totalReviews,
    recentUsers,
    recentBookings
  ] = await Promise.all([
    db.collection('User').countDocuments(),
    db.collection('User').countDocuments({ role: 'student' }),
    db.collection('User').countDocuments({ role: 'teacher' }),
    db.collection('Message').countDocuments(),
    db.collection('Booking').countDocuments(),
    db.collection('Subject').countDocuments(),
    db.collection('Review').countDocuments(),
    db.collection('User').find().sort({ createdAt: -1 }).limit(5).toArray(),
    db.collection('Booking').find().sort({ createdAt: -1 }).limit(5).toArray()
  ]);

  // Statistiques par mois (derniers 6 mois)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlySignups = await db.collection('User').aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]).toArray();

  return {
    overview: {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalMessages,
      totalBookings,
      totalSubjects,
      totalReviews
    },
    charts: {
      monthlySignups
    },
    recent: {
      users: recentUsers.map(user => ({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })),
      bookings: recentBookings
    }
  };
}

// Statistiques pour l'enseignant
async function getTeacherStats(db, teacherId) {
  const [
    totalStudents,
    totalBookings,
    totalMessages,
    totalReviews,
    averageRating,
    recentBookings,
    recentMessages,
    mySubjects
  ] = await Promise.all([
    // Nombre d'étudiants uniques qui ont réservé avec cet enseignant
    db.collection('Booking').distinct('studentId', { teacherId: teacherId }).then(arr => arr.length),
    db.collection('Booking').countDocuments({ teacherId: teacherId }),
    // Messages reçus
    db.collection('Message').countDocuments({ receiverId: teacherId }),
    db.collection('Review').countDocuments({ teacherId: teacherId }),
    // Note moyenne
    db.collection('Review').aggregate([
      { $match: { teacherId: teacherId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]).toArray().then(result => result[0]?.avgRating || 0),
    // Réservations récentes
    db.collection('Booking').find({ teacherId: teacherId }).sort({ createdAt: -1 }).limit(5).toArray(),
    // Messages récents reçus
    db.collection('Message').find({ receiverId: teacherId }).sort({ createdAt: -1 }).limit(5).toArray(),
    // Mes matières
    db.collection('Subject').find({ teacherIds: teacherId }).toArray()
  ]);

  return {
    overview: {
      totalStudents,
      totalBookings,
      totalMessages,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10
    },
    recent: {
      bookings: recentBookings,
      messages: recentMessages
    },
    subjects: mySubjects
  };
}

// Statistiques pour l'étudiant
async function getStudentStats(db, studentId) {
  const [
    totalBookings,
    totalMessages,
    totalReviews,
    favoriteTeachers,
    recentBookings,
    recentMessages,
    availableSubjects
  ] = await Promise.all([
    db.collection('Booking').countDocuments({ studentId: studentId }),
    // Messages envoyés
    db.collection('Message').countDocuments({ senderId: studentId }),
    db.collection('Review').countDocuments({ studentId: studentId }),
    // Enseignants favoris (basé sur les réservations)
    db.collection('Booking').aggregate([
      { $match: { studentId: studentId } },
      { $group: { _id: '$teacherId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'User',
          localField: '_id',
          foreignField: '_id',
          as: 'teacher'
        }
      }
    ]).toArray(),
    // Réservations récentes
    db.collection('Booking').find({ studentId: studentId }).sort({ createdAt: -1 }).limit(5).toArray(),
    // Messages récents envoyés
    db.collection('Message').find({ senderId: studentId }).sort({ createdAt: -1 }).limit(5).toArray(),
    // Matières disponibles
    db.collection('Subject').find().limit(10).toArray()
  ]);

  return {
    overview: {
      totalBookings,
      totalMessages,
      totalReviews,
      favoriteTeachers: favoriteTeachers.length
    },
    recent: {
      bookings: recentBookings,
      messages: recentMessages
    },
    favoriteTeachers: favoriteTeachers.map(item => ({
      ...item.teacher[0],
      bookingCount: item.count
    })),
    availableSubjects
  };
}
