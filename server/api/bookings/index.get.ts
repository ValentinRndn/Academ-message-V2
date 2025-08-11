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
    
    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const status = query.status as string
    const role = user.role
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '10')
    const skip = (page - 1) * limit
    
    // Construire le filtre en fonction du rôle de l'utilisateur
    const filter: any = {}
    
    if (role === 'teacher') {
      filter.teacherId = user.id
    } else {
      filter.studentId = user.id
    }
    
    // Filtrer par statut si spécifié
    if (status) {
      filter.status = status
    }
    
    // Récupérer les réservations
    const bookings = await prisma.booking.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: {
        startTime: 'asc'
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
    
    // Récupérer le nombre total de réservations pour la pagination
    const totalCount = await prisma.booking.count({
      where: filter
    })
    
    return {
      bookings,
      totalCount,
      page,
      limit
    }
    
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch bookings'
    })
  }
})