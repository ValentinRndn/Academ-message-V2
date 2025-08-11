import { ref, computed } from 'vue'
import { useSocket } from './useSocket'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
  updatedAt: string
  sender?: {
    id: string
    firstName: string
    lastName: string
  }
  receiver?: {
    id: string
    firstName: string
    lastName: string
  }
}

interface MessageThreads {
  [userId: string]: {
    user: {
      id: string
      firstName: string
      lastName: string
      avatar?: string
    }
    messages: Message[]
    unreadCount: number
  }
}

export const useMessages = () => {
  const { 
    connect: connectSocket, 
    sendMessage: sendSocketMessage,
    onNewMessage,
    emitTyping,
    onUserTyping,
    isConnected
  } = useSocket()
  
  const messages = ref<Message[]>([])
  const threads = ref<MessageThreads>({})
  const currentThread = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const usersTyping = ref<Record<string, boolean>>({})

  // Initialiser la connexion socket
  const initializeSocket = async () => {
    await connectSocket()

    // Écouter les nouveaux messages
    onNewMessage((data: any) => {
      const { senderId, content } = data
      
      // Ajouter le message à la liste
      const newMessage = {
        id: data.id || `temp-${Date.now()}`,
        senderId,
        receiverId: currentThread.value || '',
        content,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      messages.value.push(newMessage)
      
      // Mettre à jour le fil de discussion
      if (threads.value[senderId]) {
        threads.value[senderId].messages.push(newMessage)
        threads.value[senderId].unreadCount++
      }
    })
    
    // Écouter quand un utilisateur est en train de taper
    onUserTyping((data: any) => {
      const { userId } = data
      usersTyping.value[userId] = true
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        usersTyping.value[userId] = false
      }, 3000)
    })
  }

  // Récupérer tous les messages
  const fetchMessages = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Vérifier si le token existe
      const token = localStorage.getItem('token')
      if (!token) {
        error.value = "Vous devez être connecté pour accéder aux messages"
        return []
      }
      
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la récupération des messages')
      }
      
      const data = await response.json()
      
      // Convertir les données en format de threads
      const messageThreads: MessageThreads = {}
      
      data.forEach((conversation: any) => {
        const partnerId = conversation.partner.id
        
        messageThreads[partnerId] = {
          user: conversation.partner,
          messages: conversation.messages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender === 'me' ? getCurrentUserId() : partnerId,
            receiverId: msg.sender === 'me' ? partnerId : getCurrentUserId(),
            content: msg.content,
            read: msg.read,
            createdAt: msg.createdAt,
            updatedAt: msg.createdAt
          })),
          unreadCount: conversation.unreadCount
        }
      })
      
      threads.value = messageThreads
      return data
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Sélectionner un fil de discussion
  const selectThread = (userId: string) => {
    currentThread.value = userId
    
    // Marquer les messages comme lus
    if (threads.value[userId]) {
      const unreadMessages = threads.value[userId].messages.filter(
        msg => !msg.read && msg.senderId === userId
      )
      
      // Mettre à jour l'état local
      unreadMessages.forEach(msg => {
        msg.read = true
      })
      
      threads.value[userId].unreadCount = 0
      
      // Mettre à jour sur le serveur
      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id)
      })
    }
  }

  // Envoyer un message
  const sendMessage = async (receiverId: string, content: string) => {
    try {
      error.value = null
      
      // Vérifier si le token existe
      const token = localStorage.getItem('token')
      if (!token) {
        error.value = "Vous devez être connecté pour envoyer des messages"
        return null
      }
      
      // Envoyer via l'API REST
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId,
          content
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de l\'envoi du message')
      }
      
      const data = await response.json()
      const newMessage = data.message
      
      // Ajouter le message à la liste
      messages.value.push(newMessage)
      
      // Mettre à jour le fil de discussion
      if (!threads.value[receiverId]) {
        threads.value[receiverId] = {
          user: {
            id: receiverId,
            firstName: '', // À remplir avec les données du destinataire
            lastName: ''
          },
          messages: [],
          unreadCount: 0
        }
      }
      
      threads.value[receiverId].messages.push(newMessage)
      
      // Envoyer via Socket.io pour la mise à jour en temps réel
      if (isConnected.value) {
        await sendSocketMessage(receiverId, content)
      }
      
      return newMessage
    } catch (err: any) {
      console.error('Error sending message:', err)
      error.value = err.message
      return null
    }
  }

  // Marquer un message comme lu
  const markMessageAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false
      
      const response = await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors du marquage du message comme lu')
      }
      
      return true
    } catch (err: any) {
      console.error('Error marking message as read:', err)
      return false
    }
  }

  // Notifier que l'utilisateur est en train de taper
  const notifyTyping = (receiverId: string) => {
    if (isConnected.value) {
      emitTyping(receiverId)
    }
  }

  // Obtenir l'ID de l'utilisateur courant à partir du token
  const getCurrentUserId = (): string => {
    const token = localStorage.getItem('token')
    if (!token) return ''
    
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) return ''
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      const decoded = JSON.parse(jsonPayload)
      return decoded.id || ''
    } catch (err) {
      console.error('Error decoding token:', err)
      return ''
    }
  }
  
  // Obtenir le dernier message d'un thread
  const getLastMessage = (userId: string) => {
    const thread = threads.value[userId]
    if (!thread || thread.messages.length === 0) return null
    
    // Trier les messages par date et prendre le dernier
    const sortedMessages = [...thread.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return sortedMessages[0]
  }
  
  // Obtenir le rôle d'un utilisateur dans un thread
  const getUserRole = (userId: string): string => {
    const thread = threads.value[userId]
    return thread?.user?.role || 'student'
  }
  
  // Formater la date d'un message pour l'affichage
  const formatTimeAgo = (time: string | undefined): string => {
    if (!time) return ''
    
    const now = new Date()
    const messageTime = new Date(time)
    const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'À l\'instant'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`
    
    return messageTime.toLocaleDateString()
  }
  
  // Filtrer les threads en fonction d'une recherche
  const filteredThreads = computed(() => {
    // Ici, vous pourriez implémenter une logique de filtrage si nécessaire
    return threads.value
  })

  return {
    messages,
    threads,
    filteredThreads,
    currentThread,
    loading,
    error,
    usersTyping,
    initializeSocket,
    fetchMessages,
    selectThread,
    sendMessage,
    notifyTyping,
    getLastMessage,
    getUserRole,
    formatTimeAgo
  }
}