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
          New Conversation
        </NuxtLink>
      </div>
    </div>
    
    <div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div class="flex h-[calc(100vh-200px)] min-h-[600px]">
        <!-- Conversation list with animated transitions -->
        <div class="w-full md:w-1/3 border-r border-gray-200 bg-gray-50">
          <div class="h-full flex flex-col">
            <!-- Search with animation -->
            <div class="p-4 border-b border-gray-200 bg-white">
              <div class="relative rounded-lg shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search conversations..."
                  class="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
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
            
            <!-- Conversation list with animations -->
            <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div v-if="loading" class="flex justify-center items-center h-full py-12">
                <div class="dots-loader">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              
              <div v-else-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
                <div class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p class="text-gray-700 font-medium text-lg">No conversations yet</p>
                <p class="text-gray-500 text-center mt-2 mb-6">Connect with a teacher to start learning</p>
                <NuxtLink 
                  to="/teachers" 
                  class="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find a Teacher
                </NuxtLink>
              </div>
              
              <div v-else>
                <button
                  v-for="conversation in filteredConversations"
                  :key="conversation.id"
                  @click="selectConversation(conversation)"
                  :class="[
                    'w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300',
                    selectedConversation && selectedConversation.id === conversation.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                  ]"
                >
                  <div class="flex items-center">
                    <div class="relative">
                      <img 
                        :src="conversation.participant.avatar" 
                        :alt="conversation.participant.firstName" 
                        class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div v-if="conversation.participant.status === 'online'" class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    <div class="ml-4 flex-1 min-w-0">
                      <div class="flex justify-between items-baseline">
                        <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                          {{ conversation.participant.firstName }} {{ conversation.participant.lastName }}
                          <span v-if="conversation.participant.role === 'teacher'" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Teacher
                          </span>
                        </h3>
                        <span class="text-xs text-gray-500">{{ formatTimeAgo(conversation.lastMessageTime) }}</span>
                      </div>
                      <p class="text-sm text-gray-600 truncate mt-1">{{ conversation.lastMessage }}</p>
                    </div>
                    <div v-if="conversation.unreadCount > 0" class="ml-3 flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-xs font-medium text-white shadow-md animate-pulse">
                        {{ conversation.unreadCount }}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Conversation detail with animations -->
        <div class="hidden md:flex md:w-2/3 flex-col bg-white">
          <div v-if="!selectedConversation" class="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 animate-fade-in">
            <div class="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
            <p class="text-gray-600 text-center max-w-md mb-8">Select a conversation from the list or start a new one to connect with teachers and improve your skills</p>
            <NuxtLink 
              to="/teachers" 
              class="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start New Conversation
            </NuxtLink>
          </div>
          
          <div v-else class="flex-1 flex flex-col animate-fade-in">
            <!-- Conversation header with hover effects -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
              <div class="flex items-center">
                <div class="relative">
                  <img 
                    :src="selectedConversation.participant.avatar" 
                    :alt="selectedConversation.participant.firstName" 
                    class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div class="ml-4">
                  <h3 class="text-md font-bold text-gray-900 flex items-center">
                    {{ selectedConversation.participant.firstName }} {{ selectedConversation.participant.lastName }}
                    <span class="online-indicator ml-2"></span>
                  </h3>
                  <p 
                    :class="[
                      'text-sm',
                      selectedConversation.participant.role === 'teacher' ? 'text-indigo-600' : 'text-gray-600'
                    ]"
                  >
                    {{ selectedConversation.participant.role === 'teacher' ? 'Teacher' : 'Student' }}
                    <span class="text-gray-400">• Online</span>
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button v-if="selectedConversation.participant.role === 'teacher'" 
                  @click="showBookingModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Session
                </button>
                <NuxtLink 
                  :to="`/teachers/${selectedConversation.participant.id}`"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:translate-y-[-2px] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Profile
                </NuxtLink>
                <button 
                  class="inline-flex items-center p-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Messages with animations and improved bubbles -->
            <div class="flex-1 p-6 overflow-y-auto bg-slate-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref="messagesContainer">
              <div class="py-3 px-5 mb-6 bg-gray-100 rounded-lg inline-block text-sm text-gray-500">
                <span class="font-medium">{{ formatDateHeader(selectedConversation.messages[0]?.time) }}</span>
              </div>
              
              <div v-if="selectedConversation.messages.length === 0" class="flex flex-col items-center justify-center h-full animate-fade-in">
                <div class="bg-white p-6 rounded-2xl shadow-sm max-w-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
                  <p class="text-gray-600 mb-4">
                    Send your first message to {{ selectedConversation.participant.firstName }} to get the conversation started
                  </p>
                </div>
              </div>
              
              <div v-else class="space-y-6">
                <div 
                  v-for="(message, index) in selectedConversation.messages" 
                  :key="index"
                  :class="[
                    message.sender === 'me' ? 'animate-message-in-right' : 'animate-message-in-left'
                  ]"
                >
                  <!-- Date separator if needed -->
                  <div v-if="index > 0 && !isSameDay(message.time, selectedConversation.messages[index-1].time)" class="py-3 px-5 my-6 bg-gray-100 rounded-lg inline-block text-sm text-gray-500">
                    <span class="font-medium">{{ formatDateHeader(message.time) }}</span>
                  </div>
                  
                  <div 
                    :class="[
                      'flex message-container',
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    ]"
                  >
                    <!-- Avatar for received messages -->
                    <div v-if="message.sender !== 'me' && (!index || selectedConversation.messages[index-1].sender !== message.sender)" class="flex-shrink-0 mr-3">
                      <img :src="selectedConversation.participant.avatar" class="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    </div>
                    
                    <div
                      :class="[
                        'max-w-[80%] px-5 py-3 rounded-2xl shadow-sm',
                        message.sender === 'me' 
                          ? 'bg-indigo-600 text-white message-sent rounded-tr-none' 
                          : 'bg-white text-gray-800 message-received rounded-tl-none'
                      ]"
                    >
                      <p class="whitespace-pre-wrap">{{ message.text }}</p>
                      <div 
                        :class="[
                          'flex items-center mt-1 space-x-1',
                          message.sender === 'me' ? 'justify-end text-indigo-200' : 'text-gray-400'
                        ]"
                      >
                        <span class="text-xs">{{ formatMessageTime(message.time) }}</span>
                        <span v-if="message.sender === 'me'" class="text-xs flex items-center">
                          <!-- Read status -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Message input with animations -->
            <div class="p-4 border-t border-gray-200 bg-white">
              <form @submit.prevent="sendMessage" class="flex items-end space-x-2">
                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    rows="1"
                    placeholder="Type a message..."
                    class="block w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    @keydown.enter.prevent="sendMessage"
                  ></textarea>
                  
                  <!-- Attachment button -->
                  <div class="absolute bottom-2 right-3 flex space-x-2">
                    <button type="button" class="text-gray-400 hover:text-indigo-500 focus:outline-none transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
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
        
        <!-- Mobile conversation detail with slide animations -->
        <div v-if="selectedConversation" class="fixed inset-0 z-10 md:hidden bg-white animate-slide-in-right">
          <div class="flex flex-col h-full">
            <!-- Mobile header -->
            <div class="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm">
              <button @click="selectedConversation = null" class="mr-3 text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div class="flex items-center flex-1 min-w-0">
                <div class="relative">
                  <img 
                    :src="selectedConversation.participant.avatar" 
                    :alt="selectedConversation.participant.firstName" 
                    class="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <h3 class="text-base font-bold text-gray-900 truncate">
                    {{ selectedConversation.participant.firstName }} {{ selectedConversation.participant.lastName }}
                  </h3>
                  <p class="text-sm text-gray-500 truncate">
                    {{ selectedConversation.participant.role === 'teacher' ? 'Teacher • Online' : 'Student • Online' }}
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button v-if="selectedConversation.participant.role === 'teacher'" 
                  @click="showBookingModal = true"
                  class="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button class="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Mobile messages -->
            <div class="flex-1 p-4 overflow-y-auto bg-slate-50 relative">
              <div class="py-3 px-5 mb-6 bg-gray-100 rounded-lg inline-block text-sm text-gray-500">
                <span class="font-medium">{{ formatDateHeader(selectedConversation.messages[0]?.time) }}</span>
              </div>
              
              <div v-if="selectedConversation.messages.length === 0" class="flex flex-col items-center justify-center h-full">
                <div class="bg-white p-6 rounded-2xl shadow-sm max-w-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
                  <p class="text-gray-600">
                    Send your first message to {{ selectedConversation.participant.firstName }}
                  </p>
                </div>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="(message, index) in selectedConversation.messages" 
                  :key="index"
                >
                  <!-- Date separator if needed -->
                  <div v-if="index > 0 && !isSameDay(message.time, selectedConversation.messages[index-1].time)" class="py-3 px-5 my-6 bg-gray-100 rounded-lg inline-block text-sm text-gray-500">
                    <span class="font-medium">{{ formatDateHeader(message.time) }}</span>
                  </div>
                  
                  <div 
                    :class="[
                      'flex',
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    ]"
                  >
                    <!-- Avatar for received messages -->
                    <div v-if="message.sender !== 'me' && (!index || selectedConversation.messages[index-1].sender !== message.sender)" class="flex-shrink-0 mr-2">
                      <img :src="selectedConversation.participant.avatar" class="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm" />
                    </div>
                    
                    <div 
                      :class="[
                        'max-w-[80%] px-4 py-2 rounded-xl shadow-sm',
                        message.sender === 'me' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-900 rounded-tl-none'
                      ]"
                    >
                      <p class="whitespace-pre-wrap">{{ message.text }}</p>
                      <div 
                        :class="[
                          'flex items-center mt-1 space-x-1',
                          message.sender === 'me' ? 'justify-end text-indigo-200' : 'text-gray-400'
                        ]"
                      >
                        <span class="text-xs">{{ formatMessageTime(message.time) }}</span>
                        <span v-if="message.sender === 'me'" class="text-xs flex items-center">
                          <!-- Read status -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile message input -->
            <div class="p-3 border-t border-gray-200 bg-white">
              <form @submit.prevent="sendMessage" class="flex items-end space-x-2">
                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    rows="1"
                    placeholder="Type a message..."
                    class="block w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    @keydown.enter.prevent="sendMessage"
                  ></textarea>
                  
                  <!-- Attachment button -->
                  <div class="absolute bottom-2 right-3 flex space-x-2">
                    <button type="button" class="text-gray-400 hover:text-indigo-500 focus:outline-none transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  :disabled="!newMessage.trim()"
                  :class="[
                    'inline-flex items-center justify-center p-3 rounded-full shadow-md focus:outline-none transition-all duration-300',
                    newMessage.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
    
    <!-- Booking modal with animations -->
    <div v-if="showBookingModal && selectedConversation" class="fixed inset-0 z-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay with animation -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in" aria-hidden="true"></div>
        
        <!-- Modal panel with entrance animation -->
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modal-in">
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button 
              @click="showBookingModal = false"
              type="button"
              class="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                  Book a Session with {{ selectedConversation.participant.firstName }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Select a date and time that works for you to get started with your learning session.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-6 space-y-5">
              <!-- Date picker with animation -->
              <div class="animate-fade-in" style="animation-delay: 100ms;">
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    id="date" 
                    type="date" 
                    v-model="bookingDate"
                    class="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <!-- Time slots with animation -->
              <div class="animate-fade-in" style="animation-delay: 200ms;">
                <label class="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="slot in availableTimeSlots" 
                    :key="slot.value"
                    @click="selectTimeSlot(slot.value)"
                    :class="[
                      'px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
                      selectedTimeSlot === slot.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    ]"
                  >
                    {{ slot.label }}
                  </button>
                </div>
              </div>
              
              <!-- Duration with animation -->
              <div class="animate-fade-in" style="animation-delay: 300ms;">
                <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Session Duration</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <select 
                    id="duration" 
                    v-model="bookingDuration"
                    class="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              
              <!-- Total price with animation -->
              <div class="pt-4 animate-fade-in" style="animation-delay: 400ms;">
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-700">Session Rate:</span>
                    <span class="text-sm text-gray-700">${{ (1.5).toFixed(2) }} / minute</span>
                  </div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-700">Duration:</span>
                    <span class="text-sm text-gray-700">{{ bookingDuration }} minutes</span>
                  </div>
                  <div class="border-t border-indigo-200 my-2 pt-2 flex justify-between items-center">
                    <span class="text-base font-bold text-gray-900">Total Price:</span>
                    <span class="text-xl font-bold text-indigo-600">${{ calculateTotalPrice() }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 text-center">
                    Your payment method will be charged only after the session is completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmBooking"
              :disabled="!isBookingValid"
              :class="[
                'w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-3 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 transform',
                isBookingValid 
                  ? 'bg-indigo-600 hover:bg-indigo-700 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-indigo-300 cursor-not-allowed'
              ]"
            >
              <span v-if="isBookingValid">Confirm Booking</span>
              <span v-else>Please Select Date & Time</span>
            </button>
            <button 
              @click="showBookingModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-5 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 transform hover:translate-y-[-2px]"
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

// Set today's date as default
const setDefaultDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  bookingDate.value = `${year}-${month}-${day}`;
};

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
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    conversations.value = [
      {
        id: '1',
        participant: {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          role: 'teacher',
          status: 'online',
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
          status: 'online',
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
      },
      {
        id: '3',
        participant: {
          id: '3',
          firstName: 'Robert',
          lastName: 'Johnson',
          role: 'teacher',
          status: 'offline',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        lastMessage: "I'll prepare some practice problems for our next session.",
        lastMessageTime: new Date(new Date().getTime() - 1 * 86400000), // 1 day ago
        unreadCount: 0,
        messages: [
          {
            sender: 'me',
            text: 'Hello Dr. Johnson, I need help preparing for my physics exam.',
            time: new Date(new Date().getTime() - 2 * 86400000) // 2 days ago
          },
          {
            sender: 'other',
            text: "Hello! I'd be happy to help. Which topics are you having trouble with?",
            time: new Date(new Date().getTime() - 2 * 86400000) // 2 days ago
          },
          {
            sender: 'me',
            text: "Mainly electromagnetism and circuits. I'm having a hard time with Kirchhoff's laws.",
            time: new Date(new Date().getTime() - 1.5 * 86400000) // 1.5 days ago
          },
          {
            sender: 'other',
            text: "I'll prepare some practice problems for our next session.",
            time: new Date(new Date().getTime() - 1 * 86400000) // 1 day ago
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
  
  // Mark messages as read (in a real app this would update the database)
  if (conversation.unreadCount > 0) {
    conversation.unreadCount = 0;
  }
  
  searchQuery.value = '';
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) {
    return;
  }
  
  selectedConversation.value.messages.push({
    sender: 'me',
    text: newMessage.value,
    time: new Date()
  });
  
  // Update last message information
  selectedConversation.value.lastMessage = newMessage.value;
  selectedConversation.value.lastMessageTime = new Date();
  
  newMessage.value = '';
  
  // Scroll to bottom of messages
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
  
  // Simulate response (in a real app, you'd receive this from a WebSocket)
  setTimeout(() => {
    if (selectedConversation.value) {
      const randomResponses = [
        "I understand your question. Let me think about it for a moment.",
        "That's a great point. I'll help you work through this.",
        "I can definitely help with that. Let's schedule a session to discuss it in detail.",
        "Interesting question! Have you tried approaching it this way?",
        "I have some resources that might be helpful for you. Let me share them."
      ];
      
      const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
      
      selectedConversation.value.messages.push({
        sender: 'other',
        text: randomResponse,
        time: new Date()
      });
      
      // Update last message information
      selectedConversation.value.lastMessage = randomResponse;
      selectedConversation.value.lastMessageTime = new Date();
      
      // Scroll to bottom of messages
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }
  }, 1500);
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
    teacherName: `${selectedConversation.value.participant.firstName} ${selectedConversation.value.participant.lastName}`,
    date: bookingDate.value,
    time: selectedTimeSlot.value,
    duration: bookingDuration.value,
    price: calculateTotalPrice()
  });
  
  // In a real app, you would call an API to create the booking
  // For now, we'll simulate success and add a system message to the conversation
  selectedConversation.value.messages.push({
    sender: 'system',
    text: `You've booked a ${bookingDuration.value}-minute session on ${formatDateForDisplay(bookingDate.value)} at ${formatTimeForDisplay(selectedTimeSlot.value)}.`,
    time: new Date()
  });
  
  // Reset booking form
  bookingDate.value = '';
  selectedTimeSlot.value = '';
  bookingDuration.value = '60';
  
  // Close modal
  showBookingModal.value = false;
  
  // Scroll to bottom of messages to show the new system message
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTimeAgo = (time) => {
  if (!time) return '';
  
  const now = new Date();
  const messageTime = new Date(time);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return messageTime.toLocaleDateString();
};

const formatMessageTime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateHeader = (time) => {
  if (!time) return '';
  
  const date = new Date(time);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
};

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate();
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const formatTimeForDisplay = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Lifecycle hooks
onMounted(() => {
  fetchConversations();
  setDefaultDate();
});

watch(() => route.query, () => {
  if (route.query.teacher) {
    const teacherId = route.query.teacher;
    const conversation = conversations.value.find(c => c.participant.id === teacherId);
    if (conversation) {
      selectConversation(conversation);
    }
  }
}, { immediate: true });

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

/* Message animations */
@keyframes message-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes message-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-message-in-right {
  animation: message-in-right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-message-in-left {
  animation: message-in-left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Modal animations */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out forwards;
}

/* Mobile slide animation */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}

/* Fade in animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

/* Online indicator */
.online-indicator {
  position: relative;
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #10b981; /* green-500 */
  border-radius: 50%;
}

.online-indicator::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #10b981;
  border-radius: 50%;
  opacity: 0.5;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>