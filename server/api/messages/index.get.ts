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
      console.error('Vérification du token échouée:', error)
      return createError({
        statusCode: 401,
        message: 'Non autorisé - Token invalide'
      })
    }
    
    // Récupérer tous les messages envoyés par l'utilisateur
    const sentMessages = await prisma.message.findMany({
      where: {
        senderId: user.id
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Récupérer tous les messages reçus par l'utilisateur
    const receivedMessages = await prisma.message.findMany({
      where: {
        receiverId: user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Regrouper les messages par conversation
    const conversations = {}
    
    // Traiter les messages envoyés
    sentMessages.forEach(message => {
      const partnerId = message.receiverId
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: message.receiver,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[partnerId].messages.push({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        sender: 'me'
      })
      
      // Mettre à jour le dernier message si celui-ci est plus récent
      if (!conversations[partnerId].lastMessage || 
          message.createdAt > conversations[partnerId].lastMessage.createdAt) {
        conversations[partnerId].lastMessage = {
          content: message.content,
          createdAt: message.createdAt
        }
      }
    })
    
    // Traiter les messages reçus
    receivedMessages.forEach(message => {
      const partnerId = message.senderId
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: message.sender,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[partnerId].messages.push({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        sender: 'other'
      })
      
      // Mettre à jour le dernier message si celui-ci est plus récent
      if (!conversations[partnerId].lastMessage || 
          message.createdAt > conversations[partnerId].lastMessage.createdAt) {
        conversations[partnerId].lastMessage = {
          content: message.content,
          createdAt: message.createdAt
        }
      }
      
      // Compter les messages non lus
      if (!message.read) {
        conversations[partnerId].unreadCount++
      }
    })
    
    // Convertir en tableau et trier par date du message le plus récent
    const conversationList = Object.values(conversations)
      .sort((a: any, b: any) => {
        if (!a.lastMessage) return 1
        if (!b.lastMessage) return -1
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      })
      .map((conversation: any) => {
        // Trier les messages par date
        conversation.messages.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        return conversation
      })
    
    return conversationList
  } catch (error: any) {
    console.error('Erreur lors de la récupération des messages:', error)
    return createError({
      statusCode: 500,
      message: 'Échec de la récupération des messages'
    })
  }
})