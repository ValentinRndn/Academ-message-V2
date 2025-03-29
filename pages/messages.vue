<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
    
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="flex h-[calc(100vh-200px)] min-h-[500px]">
        <!-- Conversation list -->
        <div class="w-full md:w-1/3 border-r border-gray-200">
          <div class="h-full flex flex-col">
            <!-- Search -->
            <div class="p-4 border-b border-gray-200">
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search conversations"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <!-- Conversation list -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="loading" class="flex justify-center items-center h-full">
                <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <div v-else-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p class="mt-2 text-gray-500 text-center">No conversations yet</p>
                <p class="text-sm text-gray-500 text-center mt-1">Start a conversation with a teacher to get help with your studies</p>
                <NuxtLink 
                  to="/teachers" 
                  class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Find a Teacher
                </NuxtLink>
              </div>
              
              <div v-else>
                <button
                  v-for="conversation in filteredConversations"
                  :key="conversation.id"
                  @click="selectConversation(conversation)"
                  :class="[
                    'w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none transition-colors',
                    selectedConversation && selectedConversation.id === conversation.id ? 'bg-indigo-50' : ''
                  ]"
                >
                  <div class="flex items-start">
                    <img 
                      :src="conversation.participant.avatar" 
                      :alt="conversation.participant.firstName" 
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div class="ml-3 flex-1 min-w-0">
                      <div class="flex justify-between items-baseline">
                        <h3 class="text-sm font-medium text-gray-900 truncate">
                          {{ conversation.participant.firstName }} {{ conversation.participant.lastName }}
                        </h3>
                        <span class="text-xs text-gray-500">{{ formatTime(conversation.lastMessageTime) }}</span>
                      </div>
                      <p class="text-sm text-gray-500 truncate">{{ conversation.lastMessage }}</p>
                    </div>
                    <div v-if="conversation.unreadCount > 0" class="ml-2 flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                        {{ conversation.unreadCount }}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Conversation detail -->
        <div class="hidden md:flex md:w-2/3 flex-col">
          <div v-if="!selectedConversation" class="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Select a conversation</h3>
            <p class="mt-1 text-gray-500 text-center">Choose a conversation from the list or start a new one</p>
          </div>
          
          <div v-else class="flex-1 flex flex-col">
            <!-- Conversation header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <div class="flex items-center">
                <img 
                  :src="selectedConversation.participant.avatar" 
                  :alt="selectedConversation.participant.firstName" 
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ selectedConversation.participant.firstName }} {{ selectedConversation.participant.lastName }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ selectedConversation.participant.role === 'teacher' ? 'Teacher' : 'Student' }}
                  </p>
                </div>
              </div>
              
              <div v-if="selectedConversation.participant.role === 'teacher'" class="flex space-x-2">
                <button 
                  @click="showBookingModal = true"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Session
                </button>
                <NuxtLink 
                  :to="`/teachers/${selectedConversation.participant.id}`"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Profile
                </NuxtLink>
              </div>
            </div>
            
            <!-- Messages -->
            <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="messagesContainer">
              <div v-if="selectedConversation.messages.length === 0" class="flex flex-col items-center justify-center h-full">
                <p class="text-gray-500">No messages yet</p>
                <p class="text-sm text-gray-500 mt-1">Start the conversation by sending a message</p>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="(message, index) in selectedConversation.messages" 
                  :key="index"
                  :class="[
                    'flex',
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  ]"
                >
                  <div 
                    :class="[
                      'max-w-[70%] rounded-lg px-4 py-2 shadow-sm',
                      message.sender === 'me' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-gray-900'
                    ]"
                  >
                    <p>{{ message.text }}</p>
                    <p 
                      :class="[
                        'text-xs mt-1',
                        message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                      ]"
                    >
                      {{ formatMessageTime(message.time) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Message input -->
            <div class="p-4 border-t border-gray-200">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type a message..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  :disabled="!newMessage.trim()"
                  :class="[
                    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm focus:outline-none',
                    newMessage.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-indigo-400 cursor-not-allowed'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Mobile conversation detail -->
        <div v-if="selectedConversation" class="fixed inset-0 z-10 md:hidden bg-white">
          <div class="flex flex-col h-full">
            <!-- Mobile header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <div class="flex items-center">
                <button @click="selectedConversation = null" class="mr-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <img 
                  :src="selectedConversation.participant.avatar" 
                  :alt="selectedConversation.participant.firstName" 
                  class="h-8 w-8 rounded-full object-cover"
                />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ selectedConversation.participant.firstName }} {{ selectedConversation.participant.lastName }}
                  </h3>
                </div>
              </div>
              
              <div v-if="selectedConversation.participant.role === 'teacher'" class="flex space-x-2">
                <button 
                  @click="showBookingModal = true"
                  class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Book
                </button>
                <NuxtLink 
                  :to="`/teachers/${selectedConversation.participant.id}`"
                  class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Profile
                </NuxtLink>
              </div>
            </div>
            
            <!-- Mobile messages -->
            <div class="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div v-if="selectedConversation.messages.length === 0" class="flex flex-col items-center justify-center h-full">
                <p class="text-gray-500">No messages yet</p>
                <p class="text-sm text-gray-500 mt-1">Start the conversation by sending a message</p>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="(message, index) in selectedConversation.messages" 
                  :key="index"
                  :class="[
                    'flex',
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  ]"
                >
                  <div 
                    :class="[
                      'max-w-[80%] rounded-lg px-4 py-2 shadow-sm',
                      message.sender === 'me' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-gray-900'
                    ]"
                  >
                    <p>{{ message.text }}</p>
                    <p 
                      :class="[
                        'text-xs mt-1',
                        message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                      ]"
                    >
                      {{ formatMessageTime(message.time) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile message input -->
            <div class="p-4 border-t border-gray-200">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type a message..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  :disabled="!newMessage.trim()"
                  :class="[
                    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm focus:outline-none',
                    newMessage.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-indigo-400 cursor-not-allowed'
                  ]"
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
    
    <!-- Booking modal -->
    <div v-if="showBookingModal && selectedConversation" class="fixed inset-0 z-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Book a Session with {{ selectedConversation.participant.firstName }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Select a date and time for your session.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-6 space-y-4">
              <!-- Date picker -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                <input 
                  id="date" 
                  type="date" 
                  v-model="bookingDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <!-- Time slots -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Available Time Slots</label>
                <div class="mt-2 grid grid-cols-3 gap-2">
                  <button 
                    v-for="slot in availableTimeSlots" 
                    :key="slot.value"
                    @click="selectTimeSlot(slot.value)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-md',
                      selectedTimeSlot === slot.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    ]"
                  >
                    {{ slot.label }}
                  </button>
                </div>
              </div>
              
              <!-- Duration -->
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700">Duration</label>
                <select 
                  id="duration" 
                  v-model="bookingDuration"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              
              <!-- Total price -->
              <div class="pt-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700">Total Price:</span>
                  <span class="text-lg font-bold text-gray-900">${{ calculateTotalPrice() }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  You will only be charged after the session is completed.
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmBooking"
              :disabled="!isBookingValid"
              :class="[
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm',
                isBookingValid 
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-indigo-300 cursor-not-allowed'
              ]"
            >
              Confirm Booking
            </button>
            <button 
              @click="showBookingModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// State
const loading = ref(true);
const conversations = ref([]);
const selectedConversation = ref(null);
const searchQuery = ref('');
const newMessage = ref('');
const messagesContainer = ref(null);
const showBookingModal = ref(false);
const bookingDate = ref('');
const selectedTimeSlot = ref('');
const bookingDuration = ref('60');

// Time slots
const availableTimeSlots = [
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '1:00 PM', value: '13:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  { label: '4:00 PM', value: '16:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '6:00 PM', value: '18:00' },
];

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) {
    return conversations.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter(conversation => {
    const fullName = `${conversation.participant.firstName} ${conversation.participant.lastName}`.toLowerCase();
    return fullName.includes(query) || conversation.lastMessage.toLowerCase().includes(query);
  });
});

const isBookingValid = computed(() => {
  return bookingDate.value && selectedTimeSlot.value;
});

// Methods
const fetchConversations = async () => {
  loading.value = true;
  
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    conversations.value = [
      {
        id: '1',
        participant: {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          role: 'teacher',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        lastMessage: 'I can help you with your calculus homework. When would you like to schedule a session?',
        lastMessageTime: new Date(new Date().getTime() - 30 * 60000), // 30 minutes ago
        unreadCount: 2,
        messages: [
          {
            sender: 'other',
            text: 'Hello! I saw your profile and I need help with calculus.',
            time: new Date(new Date().getTime() - 2 * 3600000) // 2 hours ago
          },
          {
            sender: 'me',
            text: 'Hi John, I\'m struggling with derivatives and integrals. Can you help me?',
            time: new Date(new Date().getTime() - 1.5 * 3600000) // 1.5 hours ago
          },
          {
            sender: 'other',
            text: 'Of course! I specialize in calculus. What specific topics are you having trouble with?',
            time: new Date(new Date().getTime() - 1 * 3600000) // 1 hour ago
          },
          {
            sender: 'me',
            text: 'Mainly the chain rule and integration by parts. I have an exam next week.',
            time: new Date(new Date().getTime() - 45 * 60000) // 45 minutes ago
          },
          {
            sender: 'other',
            text: 'I can help you with your calculus homework. When would you like to schedule a session?',
            time: new Date(new Date().getTime() - 30 * 60000) // 30 minutes ago
          }
        ]
      },
      {
        id: '2',
        participant: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'teacher',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        lastMessage: 'Let me know if you have any questions about the programming assignment.',
        lastMessageTime: new Date(new Date().getTime() - 2 * 3600000), // 2 hours ago
        unreadCount: 0,
        messages: [
          {
            sender: 'me',
            text: 'Hello Professor Doe, I\'m interested in learning more about data structures.',
            time: new Date(new Date().getTime() - 5 * 3600000) // 5 hours ago
          },
          {
            sender: 'other',
            text: 'Hi there! I\'d be happy to help you with data structures. What specific topics are you interested in?',
            time: new Date(new Date().getTime() - 4.5 * 3600000) // 4.5 hours ago
          },
          {
            sender: 'me',
            text: 'I\'m particularly interested in trees and graphs. I\'m working on a project that requires efficient graph traversal.',
            time: new Date(new Date().getTime() - 4 * 3600000) // 4 hours ago
          },
          {
            sender: 'other',
            text: 'Great! Trees and graphs are fascinating topics. I can help you understand different traversal algorithms like BFS and DFS.',
            time: new Date(new Date().getTime() - 3 * 3600000) // 3 hours ago
          },
          {
            sender: 'other',
            text: 'Let me know if you have any questions about the programming assignment.',
            time: new Date(new Date().getTime() - 2 * 3600000) // 2 hours ago
          }
        ]
      }
    ];
  } catch (error) {
    console.error('Error loading conversations:', error);
  } finally {
    loading.value = false;
  }
};

const selectConversation = conversation => {
  selectedConversation.value = conversation;
  searchQuery.value = '';
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim()) {
    return;
  }
  
  selectedConversation.value.messages.push({
    sender: 'me',
    text: newMessage.value,
    time: new Date()
  });
  
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  });
};

const selectTimeSlot = timeSlot => {
  selectedTimeSlot.value = timeSlot;
};

const calculateTotalPrice = () => {
  const pricePerMinute = 1.5;
  const durationInMinutes = parseInt(bookingDuration.value);
  return (durationInMinutes * pricePerMinute).toFixed(2);
};

const confirmBooking = () => {
  console.log('Booking confirmed:', {
    teacherId: selectedConversation.value.participant.id,
    date: bookingDate.value,
    time: selectedTimeSlot.value,
    duration: bookingDuration.value
  });
  
  showBookingModal.value = false;
};

const formatTime = timeString => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatMessageTime = time => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Lifecycle hooks
onMounted(fetchConversations);

watch(() => route.query, () => {
  if (route.query.teacher) {
    const teacherId = route.query.teacher;
    const conversation = conversations.value.find(c => c.participant.id === teacherId);
    if (conversation) {
      selectConversation(conversation);
    }
  }
});

</script>
