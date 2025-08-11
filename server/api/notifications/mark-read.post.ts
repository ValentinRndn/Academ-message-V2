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
    const { notificationId, markAllAsRead } = body
    
    // Marquer une notification spécifique comme lue
    if (notificationId) {
      // Vérifier que la notification existe et appartient à l'utilisateur
      const notification = await prisma.notification.findUnique({
        where: {
          id: notificationId
        }
      })
      
      if (!notification) {
        return createError({
          statusCode: 404,
          message: 'Notification not found'
        })
      }
      
      if (notification.userId !== user.id) {
        return createError({
          statusCode: 403,
          message: 'You are not authorized to mark this notification as read'
        })
      }
      
      // Marquer la notification comme lue
      await prisma.notification.update({
        where: {
          id: notificationId
        },
        data: {
          read: true
        }
      })
      
      return {
        success: true
      }
    }
    
    // Marquer toutes les notifications comme lues
    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false
        },
        data: {
          read: true
        }
      })
      
      return {
        success: true
      }
    }
    
    return createError({
      statusCode: 400,
      message: 'Either notificationId or markAllAsRead must be provided'
    })
    
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not mark notification as read'
    })
  }
})