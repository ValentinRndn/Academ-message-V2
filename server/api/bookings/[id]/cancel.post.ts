import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../../utils/jwt'

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
    
    // Récupérer l'ID de la réservation depuis l'URL
    const bookingId = event.context.params?.id
    
    if (!bookingId) {
      return createError({
        statusCode: 400,
        message: 'Booking ID is required'
      })
    }
    
    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId
      }
    })
    
    if (!booking) {
      return createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }
    
    // Vérifier que l'utilisateur est autorisé à annuler la réservation
    if (booking.studentId !== user.id && booking.teacherId !== user.id && user.role !== 'admin') {
      return createError({
        statusCode: 403,
        message: 'You are not authorized to cancel this booking'
      })
    }
    
    // Vérifier que la réservation n'est pas déjà annulée ou terminée
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return createError({
        statusCode: 400,
        message: `Cannot cancel a booking that is already ${booking.status}`
      })
    }
    
    // Récupérer les données du corps de la requête
    const body = await readBody(event)
    const { reason } = body || {}
    
    // Annuler la réservation
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status: 'cancelled',
        cancellationReason: reason || null,
        cancellationTime: new Date(),
        cancelledBy: user.id
      }
    })
    
    // Créer une notification pour l'autre partie
    const notificationUserId = user.id === booking.studentId ? booking.teacherId : booking.studentId
    const cancellerName = `${user.firstName} ${user.lastName}`
    
    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        type: 'booking_cancelled',
        message: `Réservation annulée par ${cancellerName}`,
        metadata: {
          bookingId: booking.id,
          cancellerId: user.id,
          cancellerName,
          reason: reason || null
        },
        read: false
      }
    })
    
    return {
      success: true,
      booking: updatedBooking
    }
    
  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not cancel booking'
    })
  }
})