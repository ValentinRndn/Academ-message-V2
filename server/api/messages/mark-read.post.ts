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
    
    // Vérifier et décoder le token
    const user = verifyToken(token)
    
    // Récupérer les données du corps de la requête
    const body = await readBody(event)
    const { messageId } = body
    
    if (!messageId) {
      return createError({
        statusCode: 400,
        message: 'messageId is required'
      })
    }
    
    // Vérifier si le message existe et si l'utilisateur est le destinataire
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })
    
    if (!message) {
      return createError({
        statusCode: 404,
        message: 'Message not found'
      })
    }
    
    // Vérifier si l'utilisateur est le destinataire du message
    if (message.receiverId !== user.id) {
      return createError({
        statusCode: 403,
        message: 'You are not authorized to mark this message as read'
      })
    }
    
    // Marquer le message comme lu
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { read: true }
    })
    
    return {
      success: true,
      message: updatedMessage
    }
    
  } catch (error: any) {
    console.error('Error marking message as read:', error)
    
    return createError({
      statusCode: 500,
      message: error.message || 'Error marking message as read'
    })
  }
})