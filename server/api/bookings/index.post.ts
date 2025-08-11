import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const authHeader = getHeader(event, 'authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    
    const user = verifyToken(token)
    
    // Récupérer les données du corps de la requête
    const body = await readBody(event)
    const { teacherId, availabilityId, startTime, endTime, notes } = body
    
    // Validation des données
    if (!teacherId || !startTime || !endTime) {
      return createError({
        statusCode: 400,
        message: 'teacherId, startTime, and endTime are required'
      })
    }
    
    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findUnique({
      where: {
        id: teacherId,
        role: 'teacher'
      }
    })
    
    if (!teacher) {
      return createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    // Vérifier si le créneau est disponible
    const bookingExists = await prisma.booking.findFirst({
      where: {
        teacherId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            // Vérifie si une réservation existante chevauche le début du nouveau créneau
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) }
          },
          {
            // Vérifie si une réservation existante chevauche la fin du nouveau créneau
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) }
          }
        ]
      }
    })
    
    if (bookingExists) {
      return createError({
        statusCode: 409,
        message: 'This time slot is already booked'
      })
    }
    
    // Si un ID de disponibilité est fourni, vérifier qu'il existe et qu'il appartient bien à l'enseignant
    if (availabilityId) {
      const availability = await prisma.availability.findUnique({
        where: {
          id: availabilityId,
          teacherId
        }
      })
      
      if (!availability) {
        return createError({
          statusCode: 404,
          message: 'Availability not found'
        })
      }
    }
    
    // Calculer le prix de la session (pour l'instant, un prix fixe)
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)
    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)
    
    // Prix arbitraire de 1.5€ par minute
    const pricePerMinute = 1.5
    const amount = durationInMinutes * pricePerMinute
    
    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        teacherId,
        studentId: user.id,
        availabilityId,
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'pending',
        paymentStatus: 'pending',
        amount,
        currency: 'EUR',
        notes
      }
    })
    
    // Créer une notification pour l'enseignant
    await prisma.notification.create({
      data: {
        userId: teacherId,
        type: 'new_booking',
        message: `Nouvelle demande de réservation de ${user.firstName} ${user.lastName}`,
        metadata: {
          bookingId: booking.id,
          studentId: user.id,
          studentName: `${user.firstName} ${user.lastName}`
        },
        read: false
      }
    })
    
    return {
      success: true,
      booking
    }
    
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not create booking'
    })
  }
})