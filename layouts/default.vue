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
    
    <!-- Alerte de session expirée -->
    <SessionExpiredAlert />
    
    <!-- Notifications globales -->
    <NotificationsContainer />

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
          <span class="text-indigo-600 font-semibold text-sm">
            {{ user?.firstName?.charAt(0) || 'U' }}{{ user?.lastName?.charAt(0) || 'S' }}
          </span>
        </div>
        <div class="flex-1">
          <div class="font-semibold text-gray-800">{{ user?.firstName }} {{ user?.lastName }}</div>
          <div class="text-xs text-gray-500 capitalize">{{ getRoleLabel(user?.role) }} • En ligne</div>
        </div>
        <button @click="handleLogout" 
          class="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors" 
          title="Se déconnecter">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
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
          <NuxtLink v-for="item in navigation" :key="item.to" 
            :to="item.to" 
            class="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2 transition-colors"
            :class="{ 'text-indigo-600 bg-indigo-50': $route.path === item.to }">
            <component :is="getNavIcon(item.icon)" class="h-5 w-5 mr-3" 
              :class="$route.path === item.to ? 'text-indigo-600' : 'text-gray-500'" />
            {{ item.name }}
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
          <div class="absolute bottom-full left-0 h-1 bg-indigo-600 transition-all duration-300 ease-in-out"
               :style="{ width: `${100/mobileNavigation.length}%`, transform: `translateX(${activeMobileTabPosition}%)` }"></div>
          
          <NuxtLink v-for="item in mobileNavigation" :key="item.to"
            :to="item.to" 
            class="mobile-nav-item" 
            :class="{ 'text-indigo-600': $route.path === item.to }"
            :style="{ width: `${100/mobileNavigation.length}%` }">
            <component :is="getNavIcon(item.icon)" class="h-6 w-6" />
            <span class="text-xs mt-1 font-medium">{{ item.name }}</span>
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
const { navigation, mobileNavigation } = useNavigation()
const { user, logout } = useAuth()

// Calculer la position de l'indicateur actif mobile
const activeMobileTabPosition = computed(() => {
  const currentIndex = mobileNavigation.value.findIndex(item => item.to === route.path)
  return currentIndex >= 0 ? currentIndex * 100 : 0
})

// Icônes pour la navigation
const getNavIcon = (iconName) => {
  const icons = {
    home: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
    ]),
    users: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
    ]),
    chat: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' })
    ]),
    calendar: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ]),
    book: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ]),
    user: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
    ]),
    settings: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
    ]),
    chart: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ]),
    clock: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    star: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
    ])
  }
  
  return icons[iconName] || icons.home
}

// Fonction pour gérer la déconnexion
const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

// Fonction pour les libellés de rôle
const getRoleLabel = (role) => {
  const labels = {
    admin: 'administrateur',
    teacher: 'enseignant',
    student: 'étudiant'
  }
  return labels[role] || 'utilisateur'
}
</script>

<style scoped>
/* Assurer que la sidebar a une hauteur complète sur desktop */
@media (min-width: 768px) {
  .md\:h-screen {
    height: 100vh;
  }
  
  /* Ajuster le contenu principal pour laisser de l'espace pour la sidebar seulement sur les pages avec sidebar */
  body:not(.no-sidebar) main {
    margin-left: 16rem; /* 64px * 4 = 256px = 16rem */
  }
  
  /* Ajuster le header pour laisser de l'espace pour la sidebar seulement sur les pages avec sidebar */
  body:not(.no-sidebar) header {
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
  flex: 1;
}

/* Animation pour l'indicateur de position */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>