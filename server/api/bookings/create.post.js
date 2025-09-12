import Booking from '../../models/Booking.js';
import Teacher from '../../models/Teacher.js';
import Subject from '../../models/Subject.js';
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

    // Seuls les étudiants peuvent créer des réservations
    if (auth.user.role !== 'student') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Seuls les étudiants peuvent faire des réservations'
      });
    }

    const body = await readBody(event);
    const { teacherId, subjectId, startTime, endTime, studentNotes } = body;

    // Validation des données
    if (!teacherId || !subjectId || !startTime || !endTime) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Toutes les informations de réservation sont obligatoires'
      });
    }

    // Validation des IDs
    if (!ObjectId.isValid(teacherId) || !ObjectId.isValid(subjectId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'IDs de professeur ou matière invalides'
      });
    }

    // Convertir les dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Validation des dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Dates invalides'
      });
    }

    if (start <= now) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'La séance doit être planifiée dans le futur'
      });
    }

    if (end <= start) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    // Calculer la durée en minutes
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    if (duration < 30) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'La durée minimale d\'une séance est de 30 minutes'
      });
    }

    if (duration > 480) { // 8 heures max
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'La durée maximale d\'une séance est de 8 heures'
      });
    }

    // Vérifier que le professeur existe et récupérer ses informations
    const teacher = await Teacher.findById(teacherId).populate('subjects');
    if (!teacher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Professeur non trouvé'
      });
    }

    // Vérifier que le professeur enseigne cette matière
    const teachesSubject = teacher.subjects.some(
      subject => subject._id.toString() === subjectId
    );

    if (!teachesSubject) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Ce professeur n\'enseigne pas cette matière'
      });
    }

    // Vérifier que la matière existe
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Matière non trouvée'
      });
    }

    // Vérifier qu'il n'y a pas de conflit d'horaires pour le professeur
    const conflict = await Booking.checkTimeConflict(
      new ObjectId(teacherId), 
      start, 
      end
    );

    if (conflict) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Ce créneau horaire n\'est pas disponible'
      });
    }

    // Vérifier que l'étudiant n'a pas déjà une réservation sur ce créneau
    const studentConflict = await Booking.findOne({
      studentId: new ObjectId(auth.user._id),
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        { startTime: { $lte: start }, endTime: { $gt: start } },
        { startTime: { $lt: end }, endTime: { $gte: end } },
        { startTime: { $gte: start }, endTime: { $lte: end } }
      ]
    });

    if (studentConflict) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Vous avez déjà une réservation sur ce créneau horaire'
      });
    }

    // TODO: Vérifier que le créneau correspond aux disponibilités du professeur
    // (Pour l'instant, on suppose que le front-end ne propose que les créneaux disponibles)

    // Calculer les montants
    const durationInHours = duration / 60;
    const teacherAmount = Math.round(durationInHours * teacher.hourlyRate * 100) / 100;
    const totalAmount = Math.round((teacherAmount + 5) * 100) / 100; // +5€ commission

    // Créer la réservation
    const booking = new Booking({
      teacherId: new ObjectId(teacherId),
      studentId: new ObjectId(auth.user._id),
      subjectId: new ObjectId(subjectId),
      startTime: start,
      endTime: end,
      duration: duration,
      teacherHourlyRate: teacher.hourlyRate,
      platformCommission: 5, // Commission fixe de 5€
      teacherAmount: teacherAmount,
      totalAmount: totalAmount,
      studentNotes: studentNotes || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    // Populer les informations pour la réponse
    await booking.populate([
      { path: 'teacherId', select: 'firstName lastName email' },
      { path: 'subjectId', select: 'name' }
    ]);

    console.log(`Nouvelle réservation créée: ${booking._id} - ${teacher.firstName} ${teacher.lastName} - ${subject.name}`);

    // Envoyer des notifications (en arrière-plan)
    try {
      const { notifyBookingCreated } = await import('../../utils/notifications.js');
      notifyBookingCreated(booking, teacher, auth.user);
    } catch (notificationError) {
      console.error('Erreur lors de l\'envoi de notification:', notificationError);
    }

    return {
      booking: booking.toObject(),
      message: 'Réservation créée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la création de la réservation'
    });
  }
});
