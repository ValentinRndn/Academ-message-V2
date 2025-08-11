import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

// Socket.io client instance
let socket: Socket | null = null
const isConnected = ref(false)
const connectionError = ref<string | null>(null)

export const useSocket = () => {
  const connect = async () => {
    try {
      // Si déjà connecté, ne rien faire
      if (socket && isConnected.value) return

      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        connectionError.value = 'Non authentifié'
        return
      }

      // Initialiser la connexion Socket.io avec le token
      socket = io({
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      })

      // Événements de connexion
      socket.on('connect', () => {
        console.log('Socket.io connecté')
        isConnected.value = true
        connectionError.value = null
      })

      socket.on('connect_error', (error) => {
        console.error('Erreur de connexion Socket.io:', error)
        connectionError.value = error.message
        isConnected.value = false
      })

      socket.on('disconnect', () => {
        console.log('Socket.io déconnecté')
        isConnected.value = false
      })

    } catch (error: any) {
      console.error('Erreur lors de l\'initialisation de Socket.io:', error)
      connectionError.value = error.message
      isConnected.value = false
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
      isConnected.value = false
    }
  }

  // Fonction pour envoyer un message
  const sendMessage = (receiverId: string, content: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!socket || !isConnected.value) {
        reject(new Error('Socket non connecté'))
        return
      }

      socket.emit('send_message', { receiverId, content })
      
      // Attendre la confirmation du serveur
      socket.once('message_sent', (response) => {
        if (response.success) {
          resolve(true)
        } else {
          reject(new Error(response.error || 'Échec de l\'envoi du message'))
        }
      })
      
      // Timeout au cas où le serveur ne répond pas
      setTimeout(() => {
        reject(new Error('Délai d\'attente dépassé pour l\'envoi du message'))
      }, 5000)
    })
  }

  // Fonction pour écouter les nouveaux messages
  const onNewMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('receive_message', callback)
    }
  }

  // Fonction pour indiquer qu'on est en train d'écrire
  const emitTyping = (receiverId: string) => {
    if (socket && isConnected.value) {
      socket.emit('typing', { receiverId })
    }
  }

  // Fonction pour écouter quand quelqu'un est en train d'écrire
  const onUserTyping = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('user_typing', callback)
    }
  }

  // Fonction pour écouter le statut des utilisateurs (en ligne/hors ligne)
  const onUserStatus = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('user_status', callback)
    }
  }
  
  // Fonction pour écouter les notifications
  const onNotification = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('notification', callback)
    }
  }

  // Fonction pour nettoyer les écouteurs d'événements
  const cleanup = () => {
    if (socket) {
      socket.off('receive_message')
      socket.off('user_typing')
      socket.off('user_status')
      socket.off('notification')
    }
  }

  return {
    connect,
    disconnect,
    sendMessage,
    onNewMessage,
    emitTyping,
    onUserTyping,
    onUserStatus,
    onNotification,
    cleanup,
    isConnected,
    connectionError
  }
}