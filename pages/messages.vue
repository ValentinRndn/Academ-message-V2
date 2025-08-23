<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-8 animate-fade-in">
      <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
      <div class="ml-auto flex items-center space-x-4">
        <span v-if="unreadCount > 0" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          {{ unreadCount }} non lu{{ unreadCount > 1 ? 's' : '' }}
        </span>
        <NuxtLink 
          to="/teachers" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Conversation
        </NuxtLink>
      </div>
    </div>
    
    <div class="bg-white shadow-lg rounded-2xl overflow-hidden animate-fade-in-up">
      <div class="flex h-[calc(100vh-200px)] min-h-[600px]">
        <!-- Liste des conversations -->
        <div class="w-full md:w-1/3 bg-gray-50">
          <div class="h-full flex flex-col">
            <!-- Recherche -->
            <div class="p-4 border-b border-gray-200 bg-white">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher des conversations..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <!-- Liste des conversations -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="loading" class="flex justify-center items-center h-full">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
              
              <div v-else-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-full p-8">
                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p class="text-gray-700 font-medium">Aucune conversation</p>
                <p class="text-gray-500 text-center mt-2 mb-4">Commencez par contacter un professeur</p>
                <NuxtLink 
                  to="/teachers" 
                  class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Trouver un professeur
                </NuxtLink>
              </div>
              
              <div v-else>
                <button
                  v-for="conversation in filteredConversations"
                  :key="conversation._id"
                  @click="selectConversation(conversation)"
                  :class="[
                    'w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none transition-colors',
                    currentConversation?._id === conversation._id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                  ]"
                >
                  <div class="flex items-center">
                    <div class="relative">
                      <Avatar
                        :avatar-url="conversation.otherParticipant.avatar"
                        :alt="conversation.otherParticipant.firstName + ' ' + conversation.otherParticipant.lastName"
                        size="md"
                      />
                      <!-- Badge non lu -->
                      <div v-if="conversation.unreadCount > 0" class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                        <span class="text-xs font-bold text-white">{{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}</span>
                      </div>
                    </div>
                    <div class="ml-3 flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="text-sm font-semibold text-gray-900 truncate">
                            {{ conversation.otherParticipant.firstName }} {{ conversation.otherParticipant.lastName }}
                            <span v-if="conversation.otherParticipant.role === 'teacher'" class="ml-1 text-xs text-indigo-600">(Professeur)</span>
                          </h3>
                          <p v-if="conversation.lastMessage" class="text-sm text-gray-500 truncate mt-1">
                            {{ conversation.lastMessage.content }}
                          </p>
                        </div>
                        <span v-if="conversation.lastMessageAt" class="text-xs text-gray-400">
                          {{ formatMessageTime(conversation.lastMessageAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Zone de messages -->
        <div class="flex-1 flex flex-col">
          <!-- En-tête de conversation -->
          <div v-if="currentConversation" class="px-6 py-4 border-b border-gray-200 bg-white">
            <div class="flex items-center">
              <Avatar
                :avatar-url="currentConversation.otherParticipant.avatar"
                :alt="currentConversation.otherParticipant.firstName + ' ' + currentConversation.otherParticipant.lastName"
                size="md"
              />
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ currentConversation.otherParticipant.firstName }} {{ currentConversation.otherParticipant.lastName }}
                </h3>
                <p class="text-sm text-gray-500">{{ currentConversation.otherParticipant.email }}</p>
              </div>
            </div>
          </div>

          <!-- Zone des messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
            <div v-if="loadingMessages" class="flex justify-center items-center h-full">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            
            <div v-else-if="!currentConversation" class="flex flex-col items-center justify-center h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p class="text-lg font-medium">Sélectionnez une conversation</p>
              <p class="text-sm">Choisissez une conversation dans la liste pour commencer à échanger</p>
            </div>

            <div v-else>
              <!-- Messages -->
              <div
                v-for="message in currentMessages"
                :key="message._id"
                :class="[
                  'flex',
                  message.senderId === user?._id ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  :class="[
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.senderId === user?._id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  ]"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <p :class="[
                    'text-xs mt-1',
                    message.senderId === user?._id ? 'text-indigo-200' : 'text-gray-500'
                  ]">
                    {{ formatMessageTime(message.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Indicateur de frappe -->
              <div v-if="isOtherUserTyping" class="flex justify-start">
                <div class="bg-gray-200 rounded-lg px-4 py-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Zone de saisie -->
          <div v-if="currentConversation" class="border-t border-gray-200 px-4 py-4 bg-white">
            <form @submit.prevent="sendMessage" class="flex space-x-4">
              <input
                v-model="newMessage"
                @input="handleTyping"
                type="text"
                placeholder="Tapez votre message..."
                class="flex-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :disabled="!currentConversation"
              />
              <button
                type="submit"
                :disabled="!newMessage.trim() || !currentConversation"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useMessagesV2 } from '~/composables/useMessagesV2'

// Authentification gérée par le middleware global

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// Composable de messagerie
const {
  conversations,
  currentConversation,
  currentMessages,
  loading,
  loadingMessages,
  error,
  unreadCount,
  usersTyping,
  initializeSocket,
  fetchConversations,
  fetchMessages,
  sendMessage: sendMessageAPI,
  selectConversation,
  startTyping,
  stopTyping
} = useMessagesV2()

// État local
const searchQuery = ref('')
const newMessage = ref('')
const messagesContainer = ref(null)
let typingTimer = null

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  const query = searchQuery.value.toLowerCase()
  return conversations.value.filter(conv => 
    conv.otherParticipant.firstName.toLowerCase().includes(query) ||
    conv.otherParticipant.lastName.toLowerCase().includes(query) ||
    conv.otherParticipant.email.toLowerCase().includes(query)
  )
})

const isOtherUserTyping = computed(() => {
  if (!currentConversation.value) return false
  return usersTyping.value[currentConversation.value.otherParticipant._id] || false
})

// Méthodes
const formatMessageTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentConversation.value) return
  
  const content = newMessage.value.trim()
  newMessage.value = ''
  
  const message = await sendMessageAPI(
    content,
    currentConversation.value.otherParticipant._id,
    currentConversation.value._id
  )
  
  if (message) {
    scrollToBottom()
  }
}

const handleTyping = () => {
  startTyping()
  
  // Arrêter l'indicateur de frappe après 3 secondes d'inactivité
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    stopTyping()
  }, 3000)
}

// Lifecycle
onMounted(async () => {
  await initializeSocket()
  await fetchConversations()
  
  // Si une conversation est spécifiée dans l'URL, la sélectionner
  const conversationId = route.query.conversation
  if (conversationId) {
    const conversation = conversations.value.find(conv => conv._id === conversationId)
    if (conversation) {
      await selectConversation(conversation)
      scrollToBottom()
    }
  }
})

// Watcher pour scroller automatiquement
watch(() => currentMessages.value.length, () => {
  scrollToBottom()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300 {
  scrollbar-color: #d1d5db transparent;
}
</style>