import { io, Socket } from 'socket.io-client'
import { ref, watch } from 'vue'

// Socket.io client instance
let socket: Socket | null = null
const isConnected = ref(false)
const connectionError = ref<string | null>(null)

export const useSocket = () => {
  // Surveiller l'état d'authentification pour reconnecter automatiquement
  const { isAuthenticated } = useAuth()
  
  watch(isAuthenticated, (newVal) => {
    console.log('🔐 État auth changé:', newVal)
    if (newVal && !isConnected.value) {
      console.log('🔌 Reconnexion Socket.io auto après auth')
      setTimeout(() => connect(), 1000) // Petit délai pour s'assurer que l'auth est complète
    } else if (!newVal && isConnected.value) {
      console.log('🔌 Déconnexion Socket.io après logout')
      disconnect()
    }
  })

  const connect = async () => {
    try {
      // Si déjà connecté, ne rien faire
      if (socket && isConnected.value) {
        console.log('Socket.io déjà connecté')
        return
      }

      console.log('🔌 Tentative de connexion Socket.io...')

      // Récupérer les informations d'authentification depuis les cookies
      const { user, isAuthenticated } = useAuth()
      
      console.log('Auth state:', { isAuthenticated: isAuthenticated.value, user: user.value })
      
      if (!isAuthenticated.value || !user.value) {
        console.error('❌ Utilisateur non authentifié pour Socket.io')
        connectionError.value = 'Non authentifié'
        return
      }

      // Note: Le cookie auth_token est httpOnly et donc non accessible via document.cookie
      // mais il sera automatiquement envoyé par le navigateur avec withCredentials: true
      console.log('🍪 Les cookies httpOnly seront envoyés automatiquement')

                        // Initialiser la connexion Socket.io (les cookies seront automatiquement envoyés)
                  console.log('🚀 Initialisation Socket.io avec withCredentials: true')
                  socket = io(window.location.origin, { // Utiliser l'origine actuelle
                    withCredentials: true, // Important pour envoyer les cookies
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 5,
                    transports: ['websocket', 'polling'] // S'assurer que tous les transports sont disponibles
                  })

      // Événements de connexion
      socket.on('connect', () => {
        console.log('Socket.io connecté')
        isConnected.value = true
        connectionError.value = null
      })

      socket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion Socket.io:', error)
        console.error('Type d\'erreur:', error.type)
        console.error('Description:', error.description)
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

  // Fonction pour envoyer un message via Socket.io
  const sendMessage = (data: { receiverId: string, content: string, conversationId?: string }) => {
    if (!socket || !isConnected.value) {
      console.warn('Socket non connecté pour l\'envoi du message')
      return
    }

    socket.emit('send_message', data)
  }

  // Fonction pour écouter les nouveaux messages
  const onNewMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('receive_message', callback)
    }
  }

  // Fonction pour rejoindre une room de conversation
  const joinRoom = (room: string) => {
    if (socket && isConnected.value) {
      socket.emit('join_conversation', room.replace('conversation_', ''))
    }
  }

  // Fonction pour quitter une room de conversation
  const leaveRoom = (room: string) => {
    if (socket && isConnected.value) {
      socket.emit('leave_conversation', room.replace('conversation_', ''))
    }
  }

  // Fonction pour indiquer qu'on est en train d'écrire
  const emitTyping = (data: { conversationId: string, isTyping?: boolean }) => {
    if (socket && isConnected.value) {
      if (data.isTyping !== false) {
        socket.emit('typing_start', { conversationId: data.conversationId })
      } else {
        socket.emit('typing_stop', { conversationId: data.conversationId })
      }
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
    joinRoom,
    leaveRoom,
    cleanup,
    isConnected,
    connectionError
  }
}