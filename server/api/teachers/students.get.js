import Booking from '../../models/Booking.js';
import User from '../../models/userModel.js';
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
    const { status, subject, search } = query;

    // Récupérer tous les étudiants qui ont eu des cours avec ce professeur
    const bookings = await Booking.find({
      teacherId: new ObjectId(auth.user._id)
    }).populate('studentId', 'firstName lastName email role subjects status createdAt');

    // Créer un Map pour éviter les doublons et agréger les données
    const studentsMap = new Map();

    for (const booking of bookings) {
      const student = booking.studentId;
      if (!student || student.role !== 'student') continue;

      const studentId = student._id.toString();
      
      if (!studentsMap.has(studentId)) {
        // Calculer les statistiques de base
        const studentBookings = bookings.filter(b => b.studentId._id.toString() === studentId);
        const totalCourses = studentBookings.length;
        const totalHours = studentBookings.reduce((sum, b) => sum + (b.duration || 1), 0);
        const completedBookings = studentBookings.filter(b => b.status === 'completed');
        const averageRating = completedBookings.length > 0 
          ? (completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / completedBookings.length).toFixed(1)
          : 0;
        
        const lastCourse = studentBookings
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];

        studentsMap.set(studentId, {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          status: student.status || 'active',
          subjects: student.subjects || [],
          totalCourses,
          totalHours,
          averageRating: parseFloat(averageRating),
          lastCourseDate: lastCourse ? lastCourse.startTime : null,
          lastActivity: lastCourse ? getTimeAgo(lastCourse.startTime) : 'Jamais',
          recentProgress: Math.floor(Math.random() * 40) + 60, // Simulation
          isNew: totalCourses <= 3,
          createdAt: student.createdAt
        });
      }
    }

    let students = Array.from(studentsMap.values());

    // Appliquer les filtres
    if (status && status !== 'all') {
      students = students.filter(student => {
        switch (status) {
          case 'active':
            return student.status === 'active';
          case 'inactive':
            return student.status === 'inactive';
          case 'new':
            return student.isNew;
          default:
            return true;
        }
      });
    }

    if (subject && subject !== 'all') {
      students = students.filter(student => 
        student.subjects.includes(subject)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(student => 
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }

    // Trier par date du dernier cours (plus récent en premier)
    students.sort((a, b) => {
      if (!a.lastCourseDate && !b.lastCourseDate) return 0;
      if (!a.lastCourseDate) return 1;
      if (!b.lastCourseDate) return -1;
      return new Date(b.lastCourseDate) - new Date(a.lastCourseDate);
    });

    // Calculer les statistiques globales
    const stats = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.status === 'active').length,
      totalHours: students.reduce((sum, s) => sum + s.totalHours, 0),
      averageRating: students.length > 0 
        ? (students.reduce((sum, s) => sum + s.averageRating, 0) / students.length).toFixed(1)
        : 0
    };

    return {
      students,
      stats
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des étudiants'
    });
  }
});

// Fonction utilitaire pour calculer le temps écoulé
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return new Date(date).toLocaleDateString('fr-FR');
}
