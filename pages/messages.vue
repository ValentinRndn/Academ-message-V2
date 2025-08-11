<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-8 animate-fade-in">
      <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
      <div class="ml-auto">
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
        <!-- Liste des conversations avec transitions animées -->
        <div class="w-full md:w-1/3 bg-gray-50">
          <div class="h-full flex flex-col">
            <!-- Recherche avec animation -->
            <div class="p-4 border-b-[1px] border-opacity-10 border-b-gray-300 bg-white">
              <div class="relative rounded-lg shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher des conversations..."
                  class="block w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Liste des conversations avec animations -->
            <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div v-if="loading" class="flex justify-center items-center h-full py-12">
                <div class="dots-loader">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              
              <div v-else-if="threads.length === 0" class="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
                <div class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p class="text-gray-700 font-medium text-lg">Pas encore de conversations</p>
                <p class="text-gray-500 text-center mt-2 mb-6">Connectez-vous avec un enseignant pour commencer à apprendre</p>
                <NuxtLink 
                  to="/teachers" 
                  class="inline-flex items-center px-5 py-3 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Trouver un enseignant
                </NuxtLink>
              </div>
              
              <div v-else>
                <button
                  v-for="(thread, userId) in filteredThreads"
                  :key="userId"
                  @click="selectThread(userId)"
                  :class="[
                    'w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300',
                    currentThread === userId ? 'bg-indigo-50' : ''
                  ]"
                >
                  <div class="flex items-center">
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                        {{ thread.user.firstName.charAt(0) }}{{ thread.user.lastName.charAt(0) }}
                      </div>
                      <div v-if="userStatuses[userId] === 'online'" class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div class="ml-4 flex-1 min-w-0">
                      <div class="flex justify-between items-baseline">
                        <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                          {{ thread.user.firstName }} {{ thread.user.lastName }}
                          <span v-if="getUserRole(userId) === 'teacher'" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Enseignant
                          </span>
                        </h3>
                        <span class="text-xs text-gray-500">{{ formatTimeAgo(getLastMessage(userId)?.createdAt) }}</span>
                      </div>
                      <p class="text-sm text-gray-600 truncate mt-1">{{ getLastMessage(userId)?.content || '' }}</p>
                    </div>
                    <div v-if="thread.unreadCount > 0" class="ml-3 flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-xs font-medium text-white shadow-md">
                        {{ thread.unreadCount }}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Détail de la conversation avec animations -->
        <div class="hidden md:flex md:w-2/3 flex-col bg-white">
          <div v-if="!currentThread" class="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 animate-fade-in">
            <div class="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Vos Messages</h3>
            <p class="text-gray-600 text-center max-w-md mb-8">Sélectionnez une conversation dans la liste ou démarrez-en une nouvelle pour échanger avec des enseignants</p>
            <NuxtLink 
              to="/teachers" 
              class="inline-flex items-center px-5 py-3 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nouvelle Conversation
            </NuxtLink>
          </div>
          
          <div v-else class="flex-1 flex flex-col animate-fade-in">
            <!-- En-tête de conversation -->
            <div class="flex items-center justify-between p-4 border-b-[1px] border-opacity-10 border-b-gray-300 bg-white shadow-sm">
              <div class="flex items-center">
                <div class="relative">
                  <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                    {{ threads[currentThread]?.user.firstName.charAt(0) }}{{ threads[currentThread]?.user.lastName.charAt(0) }}
                  </div>
                  <div v-if="userStatuses[currentThread] === 'online'" class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div class="ml-4">
                  <h3 class="text-md font-bold text-gray-900 flex items-center">
                    {{ threads[currentThread]?.user.firstName }} {{ threads[currentThread]?.user.lastName }}
                  </h3>
                  <p class="text-sm text-indigo-600">
                    {{ getUserRole(currentThread) === 'teacher' ? 'Enseignant' : 'Étudiant' }}
                    <span v-if="userStatuses[currentThread] === 'online'" class="text-gray-400">• En ligne</span>
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button v-if="getUserRole(currentThread) === 'teacher'" 
                  @click="showBookingModal = true"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Réserver
                </button>
                <NuxtLink 
                  :to="`/teachers/${currentThread}`"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:translate-y-[-2px] shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Voir Profil
                </NuxtLink>
              </div>
            </div>
            
            <!-- Messages avec animations et bulles améliorées -->
            <div class="flex-1 p-6 overflow-y-auto bg-slate-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref="messagesContainer">
              <div v-if="threads[currentThread]?.messages.length === 0" class="flex flex-col items-center justify-center h-full animate-fade-in">
                <div class="bg-white p-6 rounded-2xl shadow-sm max-w-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Commencez la conversation</h3>
                  <p class="text-gray-600 mb-4">
                    Envoyez votre premier message à {{ threads[currentThread]?.user.firstName }} pour débuter la conversation
                  </p>
                </div>
              </div>
              
              <div v-else class="space-y-6">
                <div 
                  v-for="(message, index) in threads[currentThread]?.messages" 
                  :key="message.id"
                >                  
                  <div 
                    :class="[
                      'flex message-container',
                      message.senderId === getCurrentUserId() ? 'justify-end' : 'justify-start'
                    ]"
                  >
                    <!-- Avatar for received messages -->
                    <div v-if="message.senderId !== getCurrentUserId()" class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {{ threads[currentThread].user.firstName.charAt(0) }}
                      </div>
                    </div>
                    
                    <div
                      :class="[
                        'max-w-[80%] px-5 py-3 rounded-2xl shadow-sm',
                        message.senderId === getCurrentUserId() 
                          ? 'bg-indigo-600 text-white message-sent rounded-tr-none' 
                          : 'bg-white text-gray-800 message-received rounded-tl-none'
                      ]"
                    >
                      <p class="whitespace-pre-wrap">{{ message.content }}</p>
                      <div 
                        :class="[
                          'flex items-center mt-1 space-x-1',
                          message.senderId === getCurrentUserId() ? 'justify-end text-indigo-200' : 'text-gray-400'
                        ]"
                      >
                        <span class="text-xs">{{ formatMessageTime(message.createdAt) }}</span>
                        <span v-if="message.senderId === getCurrentUserId()" class="text-xs flex items-center">
                          <!-- Read status -->
                          <svg v-if="message.read" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="isTyping" class="flex justify-start">
                  <div class="max-w-[80%] px-5 py-3 rounded-2xl bg-white text-gray-800 shadow-sm animate-pulse">
                    <div class="flex space-x-1">
                      <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Message input with animations -->
            <div class="p-4 border-t-[1px] border-opacity-10 border-t-gray-300 bg-white">
              <form @submit.prevent="sendMessageToCurrentThread" class="flex items-end space-x-2">
                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    rows="1"
                    placeholder="Écrivez un message..."
                    class="block w-full px-4 py-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    @keydown.enter.prevent="sendMessageToCurrentThread"
                    @input="handleTyping"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  :disabled="!newMessage.trim()"
                  :class="[
                    'inline-flex items-center justify-center p-3 rounded-full shadow-md focus:outline-none transition-all duration-300 transform',
                    newMessage.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-110'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useMessages } from '../composables/useMessages';
import { useSocket } from '../composables/useSocket';

const route = useRoute();
const messagesContainer = ref(null);
const searchQuery = ref('');
const newMessage = ref('');
const showBookingModal = ref(false);
const isTyping = ref(false);
const userStatuses = ref({});
const typingTimeout = ref(null);

const {
  threads,
  currentThread,
  loading,
  error,
  initializeSocket,
  fetchMessages,
  selectThread,
  sendMessage,
  notifyTyping
} = useMessages();

const { connect: connectSocket, onUserStatus } = useSocket();

// Computed
const filteredThreads = computed(() => {
  if (!searchQuery.value) {
    return threads.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  const filtered = {};
  
  Object.keys(threads.value).forEach(userId => {
    const thread = threads.value[userId];
    const fullName = `${thread.user.firstName} ${thread.user.lastName}`.toLowerCase();
    const lastMessage = thread.messages.length > 0 
      ? thread.messages[thread.messages.length - 1].content.toLowerCase() 
      : '';
    
    if (fullName.includes(query) || lastMessage.includes(query)) {
      filtered[userId] = thread;
    }
  });
  
  return filtered;
});

// Methods
const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return '';
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    return decoded.id;
  } catch (err) {
    console.error('Erreur de décodage du token:', err);
    return '';
  }
};

const getUserRole = (userId) => {
  // Dans une application réelle, ceci viendrait du backend
  // Pour l'instant, on considère que tous les utilisateurs sauf l'utilisateur courant sont des enseignants
  return userId !== getCurrentUserId() ? 'teacher' : 'student';
};

const getLastMessage = (userId) => {
  const userThread = threads.value[userId];
  if (!userThread || userThread.messages.length === 0) return null;
  return userThread.messages[userThread.messages.length - 1];
};

const formatTimeAgo = (time) => {
  if (!time) return '';
  
  const now = new Date();
  const messageTime = new Date(time);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
  
  return messageTime.toLocaleDateString();
};

const formatMessageTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const sendMessageToCurrentThread = async () => {
  if (!newMessage.value.trim() || !currentThread) {
    return;
  }
  
  await sendMessage(currentThread.value, newMessage.value.trim());
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const handleTyping = () => {
  if (currentThread.value) {
    // Clear previous timeout
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value);
    }
    
    // Notify other user that we're typing
    notifyTyping(currentThread.value);
    
    // Set a new timeout
    typingTimeout.value = setTimeout(() => {
      typingTimeout.value = null;
    }, 3000);
  }
};

// Lifecycle
onMounted(async () => {
  // Initialize socket
  await connectSocket();
  await initializeSocket();
  
  // Fetch messages
  await fetchMessages();
  
  // Listen for user status changes
  onUserStatus((data) => {
    userStatuses.value[data.userId] = data.status;
  });
  
  // Check if there's a specific thread to open
  if (route.query.user) {
    selectThread(route.query.user);
  }
});

watch(currentThread, () => {
  // Scroll to bottom when changing threads
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
});

onBeforeUnmount(() => {
  // Clear any timeouts
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
});

</script>

<style scoped>
/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

/* Custom loading animation */
.dots-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots-loader div {
  width: 10px;
  height: 10px;
  background-color: #6366f1;
  border-radius: 50%;
  margin: 0 5px;
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.dots-loader div:nth-child(1) {
  animation-delay: -0.32s;
}

.dots-loader div:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Message bubbles styling */
.message-sent {
  position: relative;
}

.message-sent:after {
  content: '';
  position: absolute;
  top: 0;
  right: -10px;
  width: 20px;
  height: 20px;
  background-color: #6366f1; /* indigo-600 */
  border-top-right-radius: 50%;
  clip-path: polygon(0 0, 0% 100%, 100% 0);
}

.message-received {
  position: relative;
}

.message-received:after {
  content: '';
  position: absolute;
  top: 0;
  left: -10px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-top-left-radius: 50%;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

/* Animation styles */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>