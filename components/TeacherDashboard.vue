<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord Enseignant</h1>
      <p class="text-gray-600 mt-2">Bienvenue {{ user?.firstName }} {{ user?.lastName }}</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Étudiants" 
        :value="stats?.overview?.totalStudents || 0"
        icon="users"
        color="purple"
        subtitle="Élèves uniques"
      />
      <StatsCard 
        title="Réservations" 
        :value="stats?.overview?.totalBookings || 0"
        icon="calendar"
        color="purple"
        subtitle="Sessions programmées"
      />
      <StatsCard 
        title="Messages" 
        :value="stats?.overview?.totalMessages || 0"
        icon="chat"
        color="purple"
        subtitle="Messages reçus"
      />
      <StatsCard 
        title="Note moyenne" 
        :value="stats?.overview?.averageRating || 0"
        icon="star"
        color="purple"
        subtitle="Sur 5 étoiles"
        :is-rating="true"
      />
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 hidden">
      <!-- Gestion des cours -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">📚 Mes Cours</h3>
        <div class="space-y-3">
          <NuxtLink to="/teacher/schedule" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            📅 Voir mon planning
          </NuxtLink>
          <NuxtLink to="/teacher/availability" 
            class="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
            ⏰ Gérer mes disponibilités
          </NuxtLink>
          <NuxtLink to="/teacher/subjects" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            📖 Mes matières ({{ stats?.subjects?.length || 0 }})
          </NuxtLink>
        </div>
      </div>

      <!-- Communication -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">💬 Communication</h3>
        <div class="space-y-3">
          <NuxtLink to="/messages" 
            class="block w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors">
            💌 Messages ({{ unreadMessages }})
          </NuxtLink>
          <NuxtLink to="/teacher/students" 
            class="block w-full text-left px-4 py-2 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors">
            👥 Mes étudiants
          </NuxtLink>
          <button @click="toggleNotifications"
            class="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            🔔 Notifications {{ notificationsEnabled ? 'ON' : 'OFF' }}
          </button>
        </div>
      </div>

      <!-- Performance -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Performance</h3>
        <div class="space-y-3">
          <NuxtLink to="/teacher/reviews" 
            class="block w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            ⭐ Mes avis ({{ stats?.overview?.totalReviews || 0 }})
          </NuxtLink>
          <NuxtLink to="/teacher/analytics" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            📈 Statistiques détaillées
          </NuxtLink>
          <NuxtLink to="/teacher/profile" 
            class="block w-full text-left px-4 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors">
            👤 Modifier mon profil
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contenu principal en deux colonnes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Réservations récentes -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Réservations récentes</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement...</p>
          </div>
          <div v-else-if="stats?.recent?.bookings?.length" class="space-y-4">
            <div v-for="booking in stats.recent.bookings" :key="booking._id" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Session programmée</p>
                  <p class="text-sm text-gray-500">{{ formatBookingDate(booking.startTime) }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getBookingStatusClass(booking.status)">
                  {{ getBookingStatusLabel(booking.status) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p>Aucune réservation récente</p>
            <NuxtLink to="/teacher/availability" class="text-purple-600 text-sm hover:text-purple-800">
              Configurer mes disponibilités
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Mes matières -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Mes matières</h3>
        </div>
        <div class="p-6">
          <div v-if="stats?.subjects?.length" class="space-y-4">
            <div v-for="subject in stats.subjects" :key="subject._id" 
              class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ subject.name }}</h4>
                  <p class="text-sm text-gray-500 mt-1">{{ subject.description }}</p>
                </div>
                <div class="text-right">
                  <span class="text-sm text-gray-500">
                    {{ getSubjectBookingCount(subject._id) }} réservations
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p>Aucune matière assignée</p>
            <p class="text-sm text-gray-400 mt-1">Contactez l'administration pour ajouter des matières</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupérer l'utilisateur et les statistiques
const { user } = useAuth();
const { data: stats, pending: loading } = await useFetch('/api/dashboard/stats');

// État local
const unreadMessages = ref(0);
const notificationsEnabled = ref(true);

// Méthodes utilitaires
const formatBookingDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getBookingStatusClass = (status) => {
  const classes = {
    pending: 'bg-purple-100 text-purple-800',
    confirmed: 'bg-purple-100 text-purple-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getBookingStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };
  return labels[status] || status;
};

const getSubjectBookingCount = (subjectId) => {
  // Logique pour compter les réservations par matière
  return Math.floor(Math.random() * 10); // Temporaire
};

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value;
  // Ici on sauvegarderait la préférence
};

// Charger les messages non lus
onMounted(async () => {
  try {
    // unreadMessages.value = await $fetch('/api/messages/unread-count');
  } catch (error) {
    console.error('Erreur lors du chargement des messages non lus:', error);
  }
});
</script>
