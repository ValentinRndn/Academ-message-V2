import { connectToDatabase } from '../../config/database.js';
import Booking from '../../models/Booking.js';
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

    // Calculer les statistiques de l'étudiant
    const studentId = new ObjectId(auth.user._id);

    const [
      totalCourses,
      completedCourses,
      totalHours,
      uniqueTeachers,
      averageGrade
    ] = await Promise.all([
      // Total des cours réservés
      Booking.countDocuments({ studentId }),
      
      // Cours terminés
      Booking.countDocuments({ 
        studentId, 
        status: 'completed' 
      }),
      
      // Total des heures de cours
      Booking.aggregate([
        { $match: { 
          studentId, 
          status: 'completed' 
        }},
        { $group: { 
          _id: null, 
          totalHours: { $sum: { $divide: ['$duration', 60] } } 
        }}
      ]).then(result => result[0]?.totalHours || 0),
      
      // Nombre d'enseignants uniques
      Booking.aggregate([
        { $match: { studentId }},
        { $group: { _id: '$teacherId' }},
        { $count: 'count' }
      ]).then(result => result[0]?.count || 0),
      
      // Note moyenne (simulée pour l'instant)
      // TODO: Remplacer par de vraies notes quand le système de notation sera implémenté
      Promise.resolve(Math.random() * 2 + 3) // Note entre 3 et 5
    ]);

    const stats = {
      totalCourses,
      completedCourses,
      totalHours: Math.round(totalHours * 10) / 10, // Arrondir à 1 décimale
      teachersCount: uniqueTeachers,
      averageGrade: Math.round(averageGrade * 10) / 10 // Arrondir à 1 décimale
    };

    return {
      success: true,
      stats
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques étudiant:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});
