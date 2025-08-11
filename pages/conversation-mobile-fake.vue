<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header mobile avec info utilisateur -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div class="px-4 py-3 flex items-center">
        <button class="mr-3 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div class="relative">
          <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg">
            SM
          </div>
          <div class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        <div class="ml-3 flex-1">
          <h1 class="text-base font-medium text-gray-900">Sophie Martin</h1>
          <p class="text-xs text-gray-500 flex items-center">
            <span class="text-indigo-600">Enseignant</span>
            <span class="mx-1">•</span>
            <span>En ligne</span>
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button class="p-2 rounded-full bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button class="p-2 rounded-full bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Options rapides -->
      <div class="px-4 py-2 flex items-center space-x-3 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-gray-100">
        <button class="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
          Réserver
        </button>
        <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Voir profil
        </button>
        <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Documents
        </button>
        <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Exercices
        </button>
      </div>
    </header>
    
    <main class="flex-1 overflow-y-auto pb-16 p-4 space-y-4 bg-gray-50">
      <!-- Date séparatrice -->
      <div class="flex items-center justify-center">
        <div class="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
          Aujourd'hui
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
          <p class="text-sm">Je comprends. Sur quels points spécifiques aimeriez-vous que nous revenions ?</p>
          <span class="text-xs text-gray-500 block mt-1">09:20</span>
        </div>
      </div>
      
      <!-- Message de Sophie avec actions -->
      <div class="flex">
        <div class="flex-shrink-0 mr-2">
          <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
            S
          </div>
        </div>
        <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
          <p class="text-sm">Nous pouvons organiser une session aujourd'hui si vous êtes disponible. Voici mes créneaux :</p>
          <div class="mt-2 mb-1 flex flex-wrap gap-2">
            <button class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">14h - 15h</button>
            <button class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">15h - 16h</button>
            <button class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">17h - 18h</button>
          </div>
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
      
      <!-- Message de l'utilisateur -->
      <div class="flex justify-end">
        <div class="max-w-[75%] px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm message-sent">
          <p class="text-sm">Le créneau de 15h-16h me conviendrait bien.</p>
          <div class="flex justify-end items-center mt-1 space-x-1 text-indigo-200">
            <span class="text-xs">09:24</span>
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
          <p class="text-sm">Parfait ! Je vais réserver ce créneau pour vous. Je vous enverrai une invitation par email pour confirmer.</p>
          <span class="text-xs text-gray-500 block mt-1">09:28</span>
        </div>
      </div>
      
      <!-- Message avec pièce jointe -->
      <div class="flex">
        <div class="flex-shrink-0 mr-2">
          <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
            S
          </div>
        </div>
        <div class="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm message-received">
          <p class="text-sm">J'ai préparé quelques exercices supplémentaires qui pourront vous aider à mieux comprendre le concept. Voici le document :</p>
          <div class="mt-2 p-2 bg-indigo-50 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="ml-2 flex-1">
              <p class="text-xs font-medium text-indigo-700">Exercices_supplementaires.pdf</p>
              <p class="text-xs text-indigo-500">2.4 MB</p>
            </div>
            <button class="p-1 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          <span class="text-xs text-gray-500 block mt-1">09:30</span>
        </div>
      </div>
      
      <!-- Message en cours de frappe -->
      <div class="flex">
        <div class="flex-shrink-0 mr-2">
          <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
            S
          </div>
        </div>
        <div class="px-4 py-3 rounded-lg bg-white shadow-sm message-received max-w-[60%]">
          <div class="flex space-x-1 items-center h-2">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Zone d'input -->
    <div class="sticky bottom-0 bg-white border-t border-gray-200 p-3 pb-6">
      <div class="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <button class="p-1.5 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <input 
          type="text" 
          placeholder="Message..." 
          class="flex-1 bg-transparent border-0 focus:ring-0 px-3 py-2 text-sm"
        />
        <button class="p-1.5 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button class="ml-1 p-1.5 bg-indigo-600 rounded-full text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles des messages */
.message-sent {
  border-top-right-radius: 0;
  position: relative;
}

.message-sent:after {
  content: '';
  position: absolute;
  top: 0;
  right: -6px;
  width: 10px;
  height: 10px;
  background-color: #4f46e5;
  border-top-right-radius: 50%;
  clip-path: polygon(0 0, 0% 100%, 100% 0);
}

.message-received {
  border-top-left-radius: 0;
  position: relative;
}

.message-received:after {
  content: '';
  position: absolute;
  top: 0;
  left: -6px;
  width: 10px;
  height: 10px;
  background-color: white;
  border-top-left-radius: 50%;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

/* Masquer la scrollbar tout en permettant le défilement */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animation des points de chargement */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>