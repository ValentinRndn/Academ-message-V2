import { ref, computed } from 'vue'
import { useSocket } from './useSocket'
import { useToast } from './useToast'

interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'file'
  read: boolean
  readAt?: string
  conversationId: string
  deleted: boolean
  createdAt: string
  updatedAt: string
  sender?: any
}

interface Conversation {
  _id: string
  otherParticipant: {
    _id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    role: string
  }
  lastMessage?: Message
  lastMessageAt: string
  unreadCount: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface MessagesPagination {
  page: number
  limit: number
  totalMessages: number
  totalPages: number
  hasMore: boolean
}

export const useMessagesV2 = () => {
  // Socket composable
  const { 
    connect: connectSocket, 
    sendMessage: sendSocketMessage,
    onNewMessage,
    emitTyping,
    onUserTyping,
    isConnected,
    joinRoom,
    leaveRoom
  } = useSocket()

  // Toast notifications composable
  const { showSuccess, showInfo, showError } = useToast()

  // État
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const currentMessages = ref<Message[]>([])
  const loading = ref(false)
  const loadingMessages = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<MessagesPagination | null>(null)
  const usersTyping = ref<Record<string, boolean>>({})

  // Computed
  const unreadCount = computed(() => {
    return conversations.value.reduce((total, conv) => total + conv.unreadCount, 0)
  })

  // Initialiser la connexion socket
  const initializeSocket = async () => {
    await connectSocket()

    // Écouter les nouveaux messages
    onNewMessage((data: any) => {
      const { senderId, content, conversationId, timestamp } = data
      
      // Trouver la conversation correspondante
      const conversation = conversations.value.find(conv => conv._id === conversationId)
      
      // Ajouter le message à la conversation actuelle si c'est la bonne
      if (currentConversation.value && currentConversation.value._id === conversationId) {
        const newMessage: Message = {
          _id: `temp-${Date.now()}`,
          senderId,
          receiverId: currentConversation.value.otherParticipant._id,
          content,
          type: 'text',
          read: false,
          conversationId,
          deleted: false,
          createdAt: timestamp,
          updatedAt: timestamp
        }
        
        currentMessages.value.push(newMessage)
      } else if (conversation) {
        // Message reçu dans une autre conversation - afficher une notification
        showInfo(
          `Nouveau message de ${conversation.otherParticipant.firstName}`,
          content,
          5000
        )
      }

      // Mettre à jour la liste des conversations
      const convIndex = conversations.value.findIndex(conv => conv._id === conversationId)
      if (convIndex !== -1) {
        conversations.value[convIndex].unreadCount++
        conversations.value[convIndex].lastMessageAt = timestamp
      }
    })

    // Écouter les indicateurs de frappe
    onUserTyping((data: any) => {
      const { userId, isTyping } = data
      usersTyping.value[userId] = isTyping
      
      if (!isTyping) {
        setTimeout(() => {
          usersTyping.value[userId] = false
        }, 3000)
      }
    })
  }

  // Récupérer toutes les conversations
  const fetchConversations = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/messages/conversations', {
        credentials: 'include'
      })

      if (response && response.conversations) {
        conversations.value = response.conversations
        return response.conversations
      }

      return []
    } catch (err: any) {
      console.error('Error fetching conversations:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de la récupération des conversations'
      return []
    } finally {
      loading.value = false
    }
  }

  // Récupérer les messages d'une conversation
  const fetchMessages = async (conversationId: string, page: number = 1) => {
    try {
      loadingMessages.value = true
      error.value = null

      const response = await $fetch(`/api/messages/${conversationId}?page=${page}&limit=50`, {
        credentials: 'include'
      })

      if (response) {
        currentConversation.value = response.conversation
        
        if (page === 1) {
          currentMessages.value = response.messages
        } else {
          // Ajouter les anciens messages au début pour la pagination
          currentMessages.value.unshift(...response.messages)
        }
        
        pagination.value = response.pagination

        // Rejoindre la room socket pour cette conversation
        if (isConnected.value) {
          joinRoom(`conversation_${conversationId}`)
        }

        return response.messages
      }

      return []
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de la récupération des messages'
      return []
    } finally {
      loadingMessages.value = false
    }
  }

  // Envoyer un message
  const sendMessage = async (content: string, receiverId: string, conversationId?: string) => {
    try {
      if (!content.trim()) return null

      const response = await $fetch('/api/messages/send', {
        method: 'POST',
        body: {
          content: content.trim(),
          receiverId,
          conversationId
        },
        credentials: 'include'
      })

      if (response && response.message) {
        // Ajouter le message à la liste actuelle
        if (currentConversation.value && 
            (currentConversation.value._id === response.message.conversationId || 
             currentConversation.value._id === conversationId)) {
          currentMessages.value.push(response.message)
        }

        // Envoyer via socket pour la mise à jour en temps réel
        if (isConnected.value) {
          sendSocketMessage({
            receiverId,
            content: content.trim(),
            conversationId: response.message.conversationId
          })
        }

        // Mettre à jour la conversation dans la liste
        const convIndex = conversations.value.findIndex(
          conv => conv._id === response.conversation._id
        )
        if (convIndex !== -1) {
          conversations.value[convIndex].lastMessageAt = response.conversation.lastMessageAt
        }

        return response.message
      }

      return null
    } catch (err: any) {
      console.error('Error sending message:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de l\'envoi du message'
      return null
    }
  }

  // Démarrer une nouvelle conversation
  const startConversation = async (participantId: string) => {
    try {
      const response = await $fetch('/api/messages/start-conversation', {
        method: 'POST',
        body: { participantId },
        credentials: 'include'
      })

      if (response && response.conversation) {
        // Ajouter à la liste des conversations si ce n'est pas déjà fait
        const existingIndex = conversations.value.findIndex(
          conv => conv._id === response.conversation._id
        )
        
        if (existingIndex === -1) {
          conversations.value.unshift(response.conversation)
        }

        if (response.isNewConversation) {
          showSuccess(
            'Conversation créée',
            `Vous pouvez maintenant échanger avec ${response.conversation.otherParticipant.firstName}`,
            3000
          )
        }

        return response.conversation
      }

      return null
    } catch (err: any) {
      console.error('Error starting conversation:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de la création de la conversation'
      return null
    }
  }

  // Sélectionner une conversation
  const selectConversation = async (conversation: Conversation) => {
    // Quitter la room précédente
    if (currentConversation.value && isConnected.value) {
      leaveRoom(`conversation_${currentConversation.value._id}`)
    }

    currentConversation.value = conversation
    await fetchMessages(conversation._id)

    // Marquer comme lue
    const convIndex = conversations.value.findIndex(conv => conv._id === conversation._id)
    if (convIndex !== -1) {
      conversations.value[convIndex].unreadCount = 0
    }
  }

  // Indicateur de frappe
  const startTyping = () => {
    if (currentConversation.value && isConnected.value) {
      emitTyping({
        conversationId: currentConversation.value._id,
        isTyping: true
      })
    }
  }

  const stopTyping = () => {
    if (currentConversation.value && isConnected.value) {
      emitTyping({
        conversationId: currentConversation.value._id,
        isTyping: false
      })
    }
  }

  // Réinitialiser l'état
  const resetState = () => {
    conversations.value = []
    currentConversation.value = null
    currentMessages.value = []
    pagination.value = null
    error.value = null
    usersTyping.value = {}
  }

  return {
    // État
    conversations,
    currentConversation,
    currentMessages,
    loading,
    loadingMessages,
    error,
    pagination,
    usersTyping,
    unreadCount,

    // Actions
    initializeSocket,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    selectConversation,
    startTyping,
    stopTyping,
    resetState
  }
}
