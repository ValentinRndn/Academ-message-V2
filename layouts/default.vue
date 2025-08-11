<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header pour les pages avec navigation -->
    <header v-if="$route.path !== '/' && $route.path !== '/login' && $route.path !== '/register'" class="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div class="px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/">
          <h1 class="text-xl font-bold text-gray-800">Academ Message</h1>
        </NuxtLink>
      </div>
    </header>
    
    <!-- Main content avec scroll -->
    <main class="flex-1 overflow-auto bg-gray-50">
      <slot />
    </main>

    <!-- Sidebar en bas pour mobile, sur le côté pour desktop -->
    <div v-if="$route.path !== '/' && $route.path !== '/login' && $route.path !== '/register'" 
         class="bg-white border-t border-gray-200 md:border-t-0 md:border-r shadow-sm md:w-64 md:h-screen md:fixed md:top-0 md:left-0 md:flex md:flex-col">
      
      <!-- Logo section - visible uniquement sur desktop -->
      <div class="hidden md:block p-4 border-b border-gray-200">
        <NuxtLink to="/" class="text-indigo-600 text-xl font-bold flex items-center">
          <span class="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-md mr-2">AM</span>
          Academ Message
        </NuxtLink>
      </div>

      <!-- User profile section - visible uniquement sur desktop -->
      <div class="hidden md:flex p-4 border-b border-gray-200 items-center">
        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <div class="font-semibold text-gray-800">Mon Compte</div>
          <div class="text-xs text-gray-500">En ligne</div>
        </div>
      </div>

      <!-- Search bar - visible uniquement sur desktop -->
      <div class="hidden md:block p-4 border-b border-gray-200">
        <div class="relative">
          <input type="text" placeholder="Rechercher..." class="w-full bg-gray-100 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Navigation menu pour desktop -->
      <div class="hidden md:block flex-shrink-0">
        <div class="p-2 font-medium text-xs text-gray-500 uppercase tracking-wider">Menu principal</div>
        <nav>
          <NuxtLink to="/" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accueil
          </NuxtLink>

          <NuxtLink to="/messages" class="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-md mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Messages
          </NuxtLink>

          <NuxtLink to="/teachers" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Trouver des Professeurs
          </NuxtLink>

          <NuxtLink to="/profile" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profil
          </NuxtLink>

          <NuxtLink to="/admin/teachers" class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Administration
          </NuxtLink>
        </nav>
      </div>

      <!-- Recent conversations section - visible uniquement sur desktop -->
      <div class="hidden md:block">
        <div class="p-2 mt-3 font-medium text-xs text-gray-500 uppercase tracking-wider">Conversations récentes</div>
        <div class="overflow-y-auto flex-grow conversations-container">
          <div class="space-y-1">
            <!-- Conversation items -->
            <div class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 cursor-pointer rounded-md mx-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">AP</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium truncate">Alice Professeur</span>
                  <span class="text-xs text-gray-500">11:15</span>
                </div>
                <p class="text-xs text-gray-500 truncate">Bonjour, je suis disponible...</p>
              </div>
            </div>

            <div class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 cursor-pointer rounded-md mx-2">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">KD</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium truncate">Kevin Durant</span>
                  <span class="text-xs text-gray-500">10:05</span>
                </div>
                <p class="text-xs text-gray-500 truncate">Pouvez-vous m'aider avec...</p>
              </div>
            </div>

            <!-- Autres conversations -->
            <div class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 cursor-pointer rounded-md mx-2">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">MP</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium truncate">Marie Professeur</span>
                  <span class="text-xs text-gray-500">09:30</span>
                </div>
                <p class="text-xs text-gray-500 truncate">Pour le prochain cours...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation mobile fixée en bas de l'écran -->
    <nav v-if="$route.path !== '/' && $route.path !== '/login' && $route.path !== '/register'" 
         class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="max-w-md mx-auto px-2">
        <!-- Barre de navigation avec indicateur de position -->
        <div class="flex justify-around items-center relative py-2">
          <!-- Indicateur de position actif -->
          <div class="absolute bottom-full left-0 w-1/4 h-1 bg-indigo-600 transition-all duration-300 ease-in-out"
               :style="{ transform: `translateX(${activeTabPosition}%)` }"></div>
          
          <NuxtLink to="/" class="mobile-nav-item" :class="{ 'text-indigo-600': $route.path === '/' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-xs mt-1 font-medium">Accueil</span>
          </NuxtLink>

          <NuxtLink to="/messages" class="mobile-nav-item" :class="{ 'text-indigo-600': $route.path === '/messages' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Messages</span>
          </NuxtLink>

          <NuxtLink to="/teachers" class="mobile-nav-item" :class="{ 'text-indigo-600': $route.path.startsWith('/teachers') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Professeurs</span>
          </NuxtLink>

          <NuxtLink to="/profile" class="mobile-nav-item" :class="{ 'text-indigo-600': $route.path === '/profile' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-xs mt-1 font-medium">Profil</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Calculer la position de l'indicateur actif
const activeTabPosition = computed(() => {
  if (route.path === '/') return 0
  if (route.path === '/messages') return 100
  if (route.path.startsWith('/teachers')) return 200
  if (route.path === '/profile') return 300
  return 0 // Position par défaut
})
</script>

<style scoped>
/* Assurer que la sidebar a une hauteur complète sur desktop */
@media (min-width: 768px) {
  .md\:h-screen {
    height: 100vh;
  }
  
  /* Ajuster le contenu principal pour laisser de l'espace pour la sidebar */
  main {
    margin-left: 16rem; /* 64px * 4 = 256px = 16rem */
  }
  
  /* Ajuster le header pour laisser de l'espace pour la sidebar */
  header {
    margin-left: 16rem;
  }
}

/* Personnalisation du scrollbar pour les conversations */
.conversations-container {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f1f1;
  max-height: calc(100vh - 350px); /* Limiter la hauteur pour permettre le scroll */
}

.conversations-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.conversations-container::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 3px;
}

.conversations-container::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Personnalisation du scrollbar pour le contenu principal */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Assurer que le contenu principal prend tout l'espace disponible */
.min-h-screen {
  min-height: 100vh;
}

/* Ajouter un padding en bas pour le mobile afin d'éviter que le contenu ne soit caché par la barre de navigation */
@media (max-width: 767px) {
  main {
    padding-bottom: 5rem; /* Augmenté pour la nouvelle navbar */
  }
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

/* Animation pour l'indicateur de position */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>