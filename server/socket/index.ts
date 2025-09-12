import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { verifyToken } from '../utils/jwt'

// Type pour les utilisateurs connectés
interface ConnectedUser {
  userId: string
  socketId: string
}

export default function (httpServer: HttpServer) {
  console.log('🎯 Initialisation du serveur Socket.io...')
  
                // Initialisation de Socket.io
              const io = new SocketServer(httpServer, {
                cors: {
                  origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001'] : undefined,
                  methods: ['GET', 'POST'],
                  credentials: true // Important pour les cookies
                }
              })
  
  console.log('✅ Serveur Socket.io créé avec CORS pour http://localhost:3001')

  // Stocker les utilisateurs connectés
  const connectedUsers: ConnectedUser[] = []

  // Middleware d'authentification (basé sur les cookies)
  io.use((socket, next) => {
    try {
      // Récupérer le token depuis les cookies
      const cookies = socket.handshake.headers.cookie
      if (!cookies) {
        return next(new Error('Authentication error: No cookies'))
      }
      
      // Parser les cookies pour récupérer auth_token
      const authTokenMatch = cookies.match(/auth_token=([^;]+)/)
      if (!authTokenMatch) {
        return next(new Error('Authentication error: No auth token'))
      }
      
      const token = authTokenMatch[1]
      
      // Vérifier le token JWT
      const user = verifyToken(token)
      if (!user) {
        return next(new Error('Authentication error: Invalid token'))
      }
      
      // Stocker les informations de l'utilisateur dans l'objet socket
      socket.data.user = user
      return next()
    } catch (error) {
      console.error('Socket.io auth error:', error)
      return next(new Error('Authentication error'))
    }
  })

  // Événement de connexion
  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.userId)
    
    // Ajouter l'utilisateur à la liste des connectés
    connectedUsers.push({
      userId: socket.data.user.userId,
      socketId: socket.id
    })
    
    // Informer les autres que l'utilisateur est en ligne
    io.emit('user_status', {
      userId: socket.data.user.userId,
      status: 'online'
    })

    // Événement pour envoyer un message
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, conversationId } = data
        const senderId = socket.data.user.userId
        
        console.log(`Message from ${senderId} to ${receiverId} in conversation ${conversationId}`)
        
        // Envoyer le message à tous les participants de la conversation (sauf l'expéditeur)
        if (conversationId) {
          socket.to(`conversation_${conversationId}`).emit('receive_message', {
            senderId,
            receiverId,
            content,
            conversationId,
            timestamp: new Date().toISOString()
          })
        } else {
          // Fallback: envoyer directement au destinataire si pas de conversationId
          const receiverSocket = connectedUsers.find(
            user => user.userId === receiverId
          )
          
          if (receiverSocket) {
            io.to(receiverSocket.socketId).emit('receive_message', {
              senderId,
              receiverId,
              content,
              conversationId,
              timestamp: new Date().toISOString()
            })
          }
        }
        
        console.log(`Message sent successfully`)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    // Événement pour rejoindre une conversation
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`)
      console.log(`User ${socket.data.user.userId} joined conversation ${conversationId}`)
    })

    // Événement pour quitter une conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`)
      console.log(`User ${socket.data.user.userId} left conversation ${conversationId}`)
    })

    // Événement pour indiquer qu'un utilisateur est en train de taper
    socket.on('typing_start', (data) => {
      const { conversationId } = data
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.data.user.userId,
        isTyping: true
      })
    })

    // Événement pour indiquer qu'un utilisateur a arrêté de taper
    socket.on('typing_stop', (data) => {
      const { conversationId } = data
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.data.user.userId,
        isTyping: false
      })
    })
    
    // Événement pour marquer un message comme lu
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data
        const userId = socket.data.user.userId
        
        // Mettre à jour le message dans la base de données (à implémenter)
        // await markMessageAsRead(messageId, userId)
        
        // Informer l'expéditeur que le message a été lu
        socket.to(data.senderSocketId).emit('message_read', {
          messageId
        })
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    })
    
    // Événement pour les notifications de frappe
    socket.on('typing', (data) => {
      const { receiverId } = data
      
      // Trouver le socket du destinataire
      const receiverSocket = connectedUsers.find(
        user => user.userId === receiverId
      )
      
      // Informer le destinataire que l'utilisateur est en train d'écrire
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('user_typing', {
          userId: socket.data.user.id
        })
      }
    })
    
    // Événement de déconnexion
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.userId)
      
      // Retirer l'utilisateur de la liste des connectés
      const index = connectedUsers.findIndex(
        user => user.socketId === socket.id
      )
      
      if (index !== -1) {
        connectedUsers.splice(index, 1)
      }
      
      // Informer les autres que l'utilisateur est hors ligne
      io.emit('user_status', {
        userId: socket.data.user.userId,
        status: 'offline'
      })
    })
  })

  return io
}