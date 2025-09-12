import Teacher from '../../../models/Teacher.js';
import Booking from '../../../models/Booking.js';
import { connectToDatabase } from '../../../config/database.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();
    
    const teacherId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const { date, duration = 60 } = query; // durée par défaut 60 minutes

    // Validation de l'ID
    if (!ObjectId.isValid(teacherId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de professeur invalide'
      });
    }

    // Validation de la date
    if (!date) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Date requise'
      });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Date invalide'
      });
    }

    // Vérifier que la date n'est pas dans le passé
    const now = new Date();
    if (targetDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Impossible de réserver une date dans le passé'
      });
    }

    // Récupérer le professeur et ses disponibilités
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Professeur non trouvé'
      });
    }

    // Récupérer les réservations existantes pour cette date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      teacherId: new ObjectId(teacherId),
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'completed'] }
    }).sort({ startTime: 1 });

    // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    const dayOfWeek = targetDate.getDay();

    // Trouver les disponibilités pour ce jour
    const dayAvailability = teacher.availability.filter(slot => slot.dayOfWeek === dayOfWeek);

    if (dayAvailability.length === 0) {
      return {
        availableSlots: [],
        message: 'Aucune disponibilité pour cette date'
      };
    }

    // Générer tous les créneaux possibles
    const availableSlots = [];
    const slotDuration = parseInt(duration);

    for (const availability of dayAvailability) {
      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);
      
      const availabilityStart = new Date(targetDate);
      availabilityStart.setHours(startHour, startMinute, 0, 0);
      
      const availabilityEnd = new Date(targetDate);
      availabilityEnd.setHours(endHour, endMinute, 0, 0);

      // Générer des créneaux de 30 minutes dans la plage de disponibilité
      let currentSlot = new Date(availabilityStart);
      
      while (currentSlot < availabilityEnd) {
        const slotEnd = new Date(currentSlot);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        // Vérifier que le créneau ne dépasse pas la disponibilité
        if (slotEnd <= availabilityEnd) {
          // Vérifier qu'il n'y a pas de conflit avec les réservations existantes
          const hasConflict = existingBookings.some(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            
            // Vérifier s'il y a un chevauchement
            return (currentSlot < bookingEnd && slotEnd > bookingStart);
          });

          if (!hasConflict) {
            availableSlots.push({
              startTime: currentSlot.toISOString(),
              endTime: slotEnd.toISOString(),
              duration: slotDuration,
              formattedStartTime: currentSlot.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              formattedEndTime: slotEnd.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          }
        }

        // Passer au créneau suivant (30 minutes plus tard)
        currentSlot.setMinutes(currentSlot.getMinutes() + 30);
      }
    }

    // Trier les créneaux par heure de début
    availableSlots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    return {
      availableSlots,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek: dayOfWeek,
      totalSlots: availableSlots.length
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des créneaux disponibles'
    });
  }
});
