import { defineEventHandler, createError } from 'h3'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'
import { prisma } from '~/server/config/database'

export default defineEventHandler(async (event) => {
  try {
    // Extraire le token d'authentification
    const authHeader = event.node.req.headers.authorization
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Non autorisé - Aucun token fourni'
      })
    }
    
    // Vérifier le token
    let user
    try {
      user = verifyToken(token)
    } catch (error) {
      return createError({
        statusCode: 401,
        message: 'Non autorisé - Token invalide'
      })
    }
    
    // Récupérer les données du corps de la requête
    const { receiverId, content } = await readBody(event)
    
    // Validation des données
    if (!receiverId || !content) {
      return createError({
        statusCode: 400,
        message: 'Le destinataire et le contenu du message sont requis'
      })
    }
    
    // Vérifier si le destinataire existe
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })
    
    if (!receiver) {
      return createError({
        statusCode: 404,
        message: 'Destinataire non trouvé'
      })
    }
    
    // Créer le message
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        read: false
      }
    })
    
    // Retourner le message créé
    return {
      success: true,
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        read: message.read,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      }
    }
  } catch (error: any) {
    console.error('Error sending message:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Une erreur est survenue lors de l\'envoi du message'
    })
  }
})