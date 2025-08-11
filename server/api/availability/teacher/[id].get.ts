import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    const token = extractTokenFromHeader(authHeader)
    
    // Pour cette API, on permet l'accès même sans authentification
    // mais on limite certaines informations si l'utilisateur n'est pas authentifié
    let authenticatedUser = null
    if (token) {
      try {
        authenticatedUser = verifyToken(token)
      } catch (error) {
        // On ignore l'erreur si le token est invalide
      }
    }
    
    // Récupérer l'ID de l'enseignant depuis l'URL
    const teacherId = event.context.params?.id
    
    if (!teacherId) {
      return createError({
        statusCode: 400,
        message: 'Teacher ID is required'
      })
    }
    
    // Vérifier si l'enseignant existe
    const teacherExists = await prisma.user.findUnique({
      where: {
        id: teacherId,
        role: 'teacher'
      },
      select: {
        id: true
      }
    })
    
    if (!teacherExists) {
      return createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const startDate = query.startDate ? new Date(query.startDate as string) : new Date()
    const endDate = query.endDate 
      ? new Date(query.endDate as string) 
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) // Par défaut, 30 jours à partir de la date de début
    
    // Récupérer les disponibilités récurrentes de l'enseignant
    const recurringAvailability = await prisma.availability.findMany({
      where: {
        teacherId,
        recurring: true
      }
    })
    
    // Récupérer les disponibilités ponctuelles de l'enseignant
    const singleAvailability = await prisma.availability.findMany({
      where: {
        teacherId,
        recurring: false,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })
    
    // Récupérer les réservations confirmées pour bloquer ces créneaux
    const bookings = await prisma.booking.findMany({
      where: {
        teacherId,
        status: { in: ['pending', 'confirmed'] },
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        // Ne renvoyer les informations de l'étudiant que si l'utilisateur est authentifié
        studentId: authenticatedUser ? true : false,
        student: authenticatedUser ? {
          select: {
            firstName: true,
            lastName: true
          }
        } : undefined
      }
    })
    
    return {
      availability: {
        recurring: recurringAvailability,
        single: singleAvailability,
        bookings
      }
    }
  } catch (error: any) {
    console.error('Error fetching teacher availability:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch teacher availability'
    })
  }
})