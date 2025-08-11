import { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { verifyToken } from '../utils/jwt'

// Type pour les utilisateurs connectés
interface ConnectedUser {
  userId: string
  socketId: string
}

export default function (httpServer: HttpServer) {
  // Initialisation de Socket.io
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? '*' : undefined,
      methods: ['GET', 'POST']
    }
  })

  // Stocker les utilisateurs connectés
  const connectedUsers: ConnectedUser[] = []

  // Middleware d'authentification
  io.use((socket, next) => {
    try {
      // Récupérer le token du client
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }
      
      // Vérifier le token JWT
      const user = verifyToken(token)
      
      // Stocker l'ID de l'utilisateur dans l'objet socket
      socket.data.user = user
      return next()
    } catch (error) {
      return next(new Error('Authentication error'))
    }
  })

  // Événement de connexion
  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.id)
    
    // Ajouter l'utilisateur à la liste des connectés
    connectedUsers.push({
      userId: socket.data.user.id,
      socketId: socket.id
    })
    
    // Informer les autres que l'utilisateur est en ligne
    io.emit('user_status', {
      userId: socket.data.user.id,
      status: 'online'
    })

    // Événement pour envoyer un message
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data
        const senderId = socket.data.user.id
        
        // Créer le message dans la base de données (à implémenter)
        // const message = await createMessage(senderId, receiverId, content)
        
        // Envoyer le message au destinataire s'il est connecté
        const receiverSocket = connectedUsers.find(
          user => user.userId === receiverId
        )
        
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('receive_message', {
            senderId,
            content
          })
        }
        
        // Confirmer l'envoi au sender
        socket.emit('message_sent', {
          success: true,
          // messageId: message.id
        })
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('message_sent', {
          success: false,
          error: 'Failed to send message'
        })
      }
    })
    
    // Événement pour marquer un message comme lu
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data
        const userId = socket.data.user.id
        
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
      console.log('User disconnected:', socket.data.user.id)
      
      // Retirer l'utilisateur de la liste des connectés
      const index = connectedUsers.findIndex(
        user => user.socketId === socket.id
      )
      
      if (index !== -1) {
        connectedUsers.splice(index, 1)
      }
      
      // Informer les autres que l'utilisateur est hors ligne
      io.emit('user_status', {
        userId: socket.data.user.id,
        status: 'offline'
      })
    })
  })

  return io
}