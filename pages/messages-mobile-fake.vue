<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header mobile -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Messages</h1>
        <button class="p-2 rounded-full bg-indigo-50 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>
    
    <main class="flex-1 overflow-hidden pb-16">
      <!-- Vue des conversations -->
      <div class="animate-fade-in" v-if="showConversationList">
        <!-- Barre de recherche -->
        <div class="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div class="relative rounded-full bg-gray-100">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher des conversations..."
              class="block w-full bg-transparent pl-10 pr-4 py-2.5 text-sm rounded-full focus:outline-none"
            />
          </div>
        </div>

        <!-- Liste des conversations -->
        <div class="overflow-y-auto">
          <!-- Sophie Martin -->
          <div
            @click="openConversation"
            class="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer bg-indigo-50"
          >
            <div class="relative">
              <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                SM
              </div>
              <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="text-sm font-medium text-gray-900 truncate">Sophie Martin</h3>
                <span class="text-xs text-gray-500">5m</span>
              </div>
              <div class="flex items-center">
                <span class="text-xs text-indigo-600 mr-2">Enseignant</span>
                <p class="text-xs text-gray-500 truncate flex-1">Bonjour, je suis disponible pour votre session aujourd'hui</p>
              </div>
            </div>
            <div class="ml-2 flex-shrink-0">
              <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                2
              </span>
            </div>
          </div>

          <!-- Thomas Dupont -->
          <div
            class="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer"
          >
            <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
              TD
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="text-sm font-medium text-gray-900 truncate">Thomas Dupont</h3>
                <span class="text-xs text-gray-500">Hier</span>
              </div>
              <div class="flex items-center">
                <span class="text-xs text-indigo-600 mr-2">Enseignant</span>
                <p class="text-xs text-gray-500 truncate flex-1">Merci pour votre message. Nous pouvons discuter...</p>
              </div>
            </div>
          </div>

          <!-- Emma Petit -->
          <div
            class="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer"
          >
            <div class="relative">
              <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
                EP
              </div>
              <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="text-sm font-medium text-gray-900 truncate">Emma Petit</h3>
                <span class="text-xs text-gray-500">24 avr</span>
              </div>
              <div class="flex items-center">
                <span class="text-xs text-indigo-600 mr-2">Enseignant</span>
                <p class="text-xs text-gray-500 truncate flex-1">Avez-vous pu terminer l'exercice que nous avons...</p>
              </div>
            </div>
          </div>

          <!-- Paul Leroy -->
          <div
            class="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer"
          >
            <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
              PL
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="text-sm font-medium text-gray-900 truncate">Paul Leroy</h3>
                <span class="text-xs text-gray-500">18 avr</span>
              </div>
              <div class="flex items-center">
                <span class="text-xs text-indigo-600 mr-2">Enseignant</span>
                <p class="text-xs text-gray-500 truncate flex-1">Je vous ai envoyé les documents pour notre...</p>
              </div>
            </div>
            <div class="ml-2 flex-shrink-0">
              <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                1
              </span>
            </div>
          </div>
        </div>

        <!-- Bouton nouvelle conversation -->
        <div class="fixed right-5 bottom-20">
          <button class="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Vue d'une conversation -->
      <div class="h-full flex flex-col animate-fade-in" v-if="!showConversationList">
        <!-- En-tête de conversation -->
        <div class="flex items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
          <button @click="showConversationList = true" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div class="relative">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              SM
            </div>
            <div class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Sophie Martin</h3>
            <p class="text-xs text-gray-500 flex items-center">
              <span class="text-indigo-600">Enseignant</span>
              <span class="mx-1">•</span>
              <span>En ligne</span>
            </p>
          </div>
          <div class="ml-auto">
            <button class="p-2 rounded-full bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Corps de la conversation -->
        <div class="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          <!-- Message de Sophie -->
          <div class="flex">
            <div class="flex-shrink-0 mr-2">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                S
              </div>
            </div>
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
              <p class="text-sm">Bonjour ! Comment puis-je vous aider aujourd'hui ? J'ai remarqué que vous avez des questions sur le cours précédent.</p>
              <span class="text-xs text-gray-500 block mt-1">09:15</span>
            </div>
          </div>
          
          <!-- Message de l'utilisateur -->
          <div class="flex justify-end">
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm message-sent">
              <p class="text-sm">Bonjour Sophie ! Oui, j'avais quelques difficultés avec les exercices que vous nous avez envoyés la semaine dernière.</p>
              <div class="flex justify-end items-center mt-1 space-x-1 text-indigo-200">
                <span class="text-xs">09:18</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Message de Sophie -->
          <div class="flex">
            <div class="flex-shrink-0 mr-2">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                S
              </div>
            </div>
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
              <p class="text-sm">Je comprends. Sur quels points spécifiques aimeriez-vous que nous revenions ? Nous pouvons organiser une session aujourd'hui si vous êtes disponible.</p>
              <span class="text-xs text-gray-500 block mt-1">09:20</span>
            </div>
          </div>
          
          <!-- Message de l'utilisateur -->
          <div class="flex justify-end">
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm message-sent">
              <p class="text-sm">C'est surtout l'exercice 3 qui me pose problème. J'ai essayé plusieurs méthodes mais je n'arrive pas à la bonne solution. Une session aujourd'hui serait parfaite !</p>
              <div class="flex justify-end items-center mt-1 space-x-1 text-indigo-200">
                <span class="text-xs">09:23</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Message de Sophie -->
          <div class="flex">
            <div class="flex-shrink-0 mr-2">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                S
              </div>
            </div>
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
              <p class="text-sm">Parfait ! Je suis disponible de 14h à 16h aujourd'hui. Est-ce que cela vous conviendrait ? Nous pourrons revoir cet exercice ensemble et je vous montrerai la méthode à appliquer.</p>
              <span class="text-xs text-gray-500 block mt-1">09:28</span>
            </div>
          </div>
          
          <!-- Nouveau message de Sophie -->
          <div class="flex">
            <div class="flex-shrink-0 mr-2">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                S
              </div>
            </div>
            <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
              <p class="text-sm">J'ai aussi préparé quelques exercices supplémentaires qui pourront vous aider à mieux comprendre le concept. Je vous les enverrai avant notre session.</p>
              <span class="text-xs text-gray-500 block mt-1">09:30</span>
            </div>
          </div>
        </div>

        <!-- Input de message -->
        <div class="border-t border-gray-200 bg-white p-2 sticky bottom-0">
          <div class="flex items-end space-x-2 bg-gray-100 rounded-2xl px-3 py-2">
            <div class="flex-1">
              <textarea
                rows="1"
                placeholder="Message..."
                class="block w-full resize-none bg-transparent border-0 focus:ring-0 p-1 text-sm"
              ></textarea>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-full bg-indigo-600 text-white flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Navigation en bas -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="flex justify-around items-center relative">
        <!-- Indicateur de position actif -->
        <div class="absolute bottom-full left-0 w-1/4 h-1 bg-indigo-600 transition-all duration-300 ease-in-out"
             style="transform: translateX(100%);"></div>
        
        <a href="#" class="flex flex-col items-center p-2 w-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-0.5 font-medium text-gray-500">Accueil</span>
        </a>

        <a href="#" class="flex flex-col items-center p-2 w-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span class="text-xs mt-0.5 font-medium text-indigo-600">Messages</span>
        </a>

        <a href="#" class="flex flex-col items-center p-2 w-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text-xs mt-0.5 font-medium text-gray-500">Profs</span>
        </a>

        <a href="#" class="flex flex-col items-center p-2 w-1/4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs mt-0.5 font-medium text-gray-500">Profil</span>
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// État pour basculer entre la liste et la conversation
const showConversationList = ref(true);

// Méthode pour ouvrir une conversation
const openConversation = () => {
  showConversationList.value = false;
};
</script>

<style scoped>
/* Styles des messages */
.message-sent {
  border-top-right-radius: 0;
  position: relative;
}

.message-received {
  border-top-left-radius: 0;
  position: relative;
}

/* Styles des animations */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>