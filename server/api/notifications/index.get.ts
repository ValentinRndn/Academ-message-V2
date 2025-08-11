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
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '20')
    const read = query.read === 'true' ? true : query.read === 'false' ? false : undefined
    const skip = (page - 1) * limit
    
    // Construire le filtre
    const filter: any = {
      userId: user.id
    }
    
    if (read !== undefined) {
      filter.read = read
    }
    
    // Récupérer les notifications
    const notifications = await prisma.notification.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Récupérer le nombre total de notifications pour la pagination
    const totalCount = await prisma.notification.count({
      where: filter
    })
    
    // Récupérer le nombre de notifications non lues
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false
      }
    })
    
    return {
      notifications,
      totalCount,
      unreadCount,
      page,
      limit
    }
    
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch notifications'
    })
  }
})