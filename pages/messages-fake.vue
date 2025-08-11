<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
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
        <div class="flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[600px]">
          <!-- Liste des conversations -->
          <div class="w-full md:w-1/3 bg-gray-50">
            <div class="h-full flex flex-col">
              <!-- Recherche -->
              <div class="p-4 border-b-[1px] border-opacity-10 border-b-gray-300 bg-white">
                <div class="relative rounded-lg shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher des conversations..."
                    class="block w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <!-- Liste des conversations -->
              <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">              
                <div>
                  <!-- Sophie Martin -->
                  <div
                    class="w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300 bg-indigo-50"
                  >
                    <div class="flex items-center">
                      <div class="relative">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                          SM
                        </div>
                        <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div class="ml-4 flex-1 min-w-0">
                        <div class="flex justify-between items-baseline">
                          <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                            Sophie Martin
                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Enseignant
                            </span>
                          </h3>
                          <span class="text-xs text-gray-500">Il y a 5 min</span>
                        </div>
                        <p class="text-sm text-gray-600 truncate mt-1">Bonjour, je suis disponible pour votre session aujourd'hui</p>
                      </div>
                      <div class="ml-3 flex-shrink-0">
                        <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-xs font-medium text-white shadow-md">
                          2
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Thomas Dupont -->
                  <div
                    class="w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300"
                  >
                    <div class="flex items-center">
                      <div class="relative">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                          TD
                        </div>
                      </div>
                      <div class="ml-4 flex-1 min-w-0">
                        <div class="flex justify-between items-baseline">
                          <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                            Thomas Dupont
                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Enseignant
                            </span>
                          </h3>
                          <span class="text-xs text-gray-500">Hier</span>
                        </div>
                        <p class="text-sm text-gray-600 truncate mt-1">Merci pour votre message. Nous pouvons discuter de ce sujet lors de notre prochaine session.</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Emma Petit -->
                  <div
                    class="w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300"
                  >
                    <div class="flex items-center">
                      <div class="relative">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                          EP
                        </div>
                        <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div class="ml-4 flex-1 min-w-0">
                        <div class="flex justify-between items-baseline">
                          <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                            Emma Petit
                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Enseignant
                            </span>
                          </h3>
                          <span class="text-xs text-gray-500">24 avr</span>
                        </div>
                        <p class="text-sm text-gray-600 truncate mt-1">Avez-vous pu terminer l'exercice que nous avons commencé la semaine dernière?</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Paul Leroy -->
                  <div
                    class="w-full text-left px-6 py-4 hover:bg-gray-100 focus:outline-none transition-all duration-300"
                  >
                    <div class="flex items-center">
                      <div class="relative">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                          PL
                        </div>
                      </div>
                      <div class="ml-4 flex-1 min-w-0">
                        <div class="flex justify-between items-baseline">
                          <h3 class="text-sm font-semibold text-gray-900 truncate flex items-center">
                            Paul Leroy
                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Enseignant
                            </span>
                          </h3>
                          <span class="text-xs text-gray-500">18 avr</span>
                        </div>
                        <p class="text-sm text-gray-600 truncate mt-1">Je vous ai envoyé les documents pour notre prochain cours.</p>
                      </div>
                      <div class="ml-3 flex-shrink-0">
                        <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-xs font-medium text-white shadow-md">
                          1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Détail de la conversation -->
          <div class="w-full md:w-2/3 flex flex-col bg-white">
            <div class="flex-1 flex flex-col animate-fade-in">
              <!-- En-tête de conversation -->
              <div class="flex items-center justify-between p-4 border-b-[1px] border-opacity-10 border-b-gray-300 bg-white shadow-sm">
                <div class="flex items-center">
                  <div class="relative">
                    <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                      SM
                    </div>
                    <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-md font-bold text-gray-900 flex items-center">
                      Sophie Martin
                    </h3>
                    <p class="text-sm text-indigo-600">
                      Enseignant
                      <span class="text-gray-400">• En ligne</span>
                    </p>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Réserver
                  </button>
                  <button
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:translate-y-[-2px] shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Voir Profil
                  </button>
                </div>
              </div>
              
              <!-- Messages -->
              <div class="flex-1 p-6 overflow-y-auto bg-slate-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div class="space-y-6">
                  <!-- Message de Sophie -->
                  <div class="flex justify-start message-container">
                    <div class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        S
                      </div>
                    </div>
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-white text-gray-800 message-received rounded-tl-none">
                      <p class="whitespace-pre-wrap">Bonjour ! Comment puis-je vous aider aujourd'hui ? J'ai remarqué que vous avez des questions sur le cours précédent.</p>
                      <div class="flex items-center mt-1 space-x-1 text-gray-400">
                        <span class="text-xs">09:15</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message de l'utilisateur -->
                  <div class="flex justify-end message-container">
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-indigo-600 text-white message-sent rounded-tr-none">
                      <p class="whitespace-pre-wrap">Bonjour Sophie ! Oui, j'avais quelques difficultés avec les exercices que vous nous avez envoyés la semaine dernière.</p>
                      <div class="flex items-center mt-1 space-x-1 justify-end text-indigo-200">
                        <span class="text-xs">09:18</span>
                        <span class="text-xs flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message de Sophie -->
                  <div class="flex justify-start message-container">
                    <div class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        S
                      </div>
                    </div>
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-white text-gray-800 message-received rounded-tl-none">
                      <p class="whitespace-pre-wrap">Je comprends. Sur quels points spécifiques aimeriez-vous que nous revenions ? Nous pouvons organiser une session aujourd'hui si vous êtes disponible.</p>
                      <div class="flex items-center mt-1 space-x-1 text-gray-400">
                        <span class="text-xs">09:20</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message de l'utilisateur -->
                  <div class="flex justify-end message-container">
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-indigo-600 text-white message-sent rounded-tr-none">
                      <p class="whitespace-pre-wrap">C'est surtout l'exercice 3 qui me pose problème. J'ai essayé plusieurs méthodes mais je n'arrive pas à la bonne solution. Une session aujourd'hui serait parfaite !</p>
                      <div class="flex items-center mt-1 space-x-1 justify-end text-indigo-200">
                        <span class="text-xs">09:23</span>
                        <span class="text-xs flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message de Sophie -->
                  <div class="flex justify-start message-container">
                    <div class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        S
                      </div>
                    </div>
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-white text-gray-800 message-received rounded-tl-none">
                      <p class="whitespace-pre-wrap">Parfait ! Je suis disponible de 14h à 16h aujourd'hui. Est-ce que cela vous conviendrait ? Nous pourrons revoir cet exercice ensemble et je vous montrerai la méthode à appliquer.</p>
                      <div class="flex items-center mt-1 space-x-1 text-gray-400">
                        <span class="text-xs">09:28</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Nouveau message de Sophie -->
                  <div class="flex justify-start message-container">
                    <div class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        S
                      </div>
                    </div>
                    <div class="max-w-[80%] px-5 py-3 rounded-2xl shadow-sm bg-white text-gray-800 message-received rounded-tl-none">
                      <p class="whitespace-pre-wrap">J'ai aussi préparé quelques exercices supplémentaires qui pourront vous aider à mieux comprendre le concept. Je vous les enverrai avant notre session.</p>
                      <div class="flex items-center mt-1 space-x-1 text-gray-400">
                        <span class="text-xs">09:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Message input -->
              <div class="p-4 border-t-[1px] border-opacity-10 border-t-gray-300 bg-white">
                <form class="flex items-end space-x-2">
                  <div class="flex-1 relative">
                    <textarea
                      rows="1"
                      placeholder="Écrivez un message..."
                      class="block w-full px-4 py-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    ></textarea>
                  </div>
                  
                  <button
                    type="button"
                    class="inline-flex items-center justify-center p-3 rounded-full shadow-md focus:outline-none transition-all duration-300 transform bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-110"
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
    
    <!-- Navigation mobile fixée en bas de l'écran -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="max-w-md mx-auto px-2">
        <!-- Barre de navigation avec indicateur de position -->
        <div class="flex justify-around items-center relative py-2">
          <!-- Indicateur de position actif -->
          <div class="absolute bottom-full left-0 w-1/4 h-1 bg-indigo-600 transition-all duration-300 ease-in-out"
               style="transform: translateX(100%);"></div>
          
          <a href="#" class="mobile-nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-xs mt-1 font-medium">Accueil</span>
          </a>

          <a href="#" class="mobile-nav-item text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Messages</span>
          </a>

          <a href="#" class="mobile-nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Professeurs</span>
          </a>

          <a href="#" class="mobile-nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Profil</span>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

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

/* Style pour les éléments de navigation mobile */
.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: #4b5563;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  width: 25%;
}

/* Ajouter un padding en bas pour le mobile afin d'éviter que le contenu ne soit caché par la barre de navigation */
@media (max-width: 767px) {
  .min-h-screen {
    padding-bottom: 5rem;
  }
  
  /* Ajustements pour la vue mobile */
  .w-full.md\:w-1\/3 {
    height: 50vh;
    overflow-y: auto;
  }
  
  .flex.flex-col.md\:flex-row {
    display: flex;
    flex-direction: column;
    height: auto !important;
    min-height: auto !important;
  }
}
</style>