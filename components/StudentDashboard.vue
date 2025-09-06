<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord Étudiant</h1>
      <p class="text-gray-600 mt-2">Bienvenue {{ user?.firstName }} {{ user?.lastName }}</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Cours réservés" 
        :value="stats?.overview?.totalBookings || 0"
        icon="calendar"
        color="purple"
        subtitle="Sessions programmées"
      />
      <StatsCard 
        title="Messages envoyés" 
        :value="stats?.overview?.totalMessages || 0"
        icon="chat"
        color="purple"
        subtitle="Conversations actives"
      />
      <StatsCard 
        title="Avis laissés" 
        :value="stats?.overview?.totalReviews || 0"
        icon="star"
        color="purple"
        subtitle="Évaluations"
      />
      <StatsCard 
        title="Enseignants favoris" 
        :value="stats?.overview?.favoriteTeachers || 0"
        icon="heart"
        color="purple"
        subtitle="Professeurs préférés"
      />
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 hidden">
      <!-- Trouver des cours -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Trouver des cours</h3>
        <div class="space-y-3">
          <NuxtLink to="/teachers" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            👨‍🏫 Parcourir les enseignants
          </NuxtLink>
          <NuxtLink to="/student/profile" 
            class="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
            👤 Mon profil
          </NuxtLink>
          <NuxtLink to="/search" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            🔎 Recherche avancée
          </NuxtLink>
        </div>
      </div>

      <!-- Mes cours -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">📅 Mes cours</h3>
        <div class="space-y-3">
          <NuxtLink to="/student/bookings" 
            class="block w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors">
            📋 Mes réservations
          </NuxtLink>
          <NuxtLink to="/student/schedule" 
            class="block w-full text-left px-4 py-2 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors">
            🗓️ Mon planning
          </NuxtLink>
          <NuxtLink to="/student/history" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            📜 Historique des cours
          </NuxtLink>
        </div>
      </div>

      <!-- Communication -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">💬 Communication</h3>
        <div class="space-y-3">
          <NuxtLink to="/messages" 
            class="block w-full text-left px-4 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors">
            💌 Mes messages ({{ unreadMessages }})
          </NuxtLink>
          <NuxtLink to="/student/reviews" 
            class="block w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            ⭐ Mes avis
          </NuxtLink>
          <NuxtLink to="/profile" 
            class="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            👤 Mon profil
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Enseignants recommandés -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Enseignants recommandés</h3>
        </div>
        <div class="p-6">
          <div v-if="recommendedTeachers?.length" class="space-y-4">
            <div v-for="teacher in recommendedTeachers" :key="teacher._id" 
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-lg">
                    {{ teacher.firstName?.charAt(0) }}{{ teacher.lastName?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ teacher.subjects?.join(', ') || 'Plusieurs matières' }}</p>
                  <div class="flex items-center mt-1">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" 
                        :class="i <= teacher.rating ? 'text-yellow-400' : 'text-gray-300'" 
                        fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span class="text-sm text-gray-500 ml-1">({{ teacher.reviewCount || 0 }})</span>
                  </div>
                </div>
              </div>
              <div>
                <NuxtLink :to="`/teachers/${teacher._id}`" 
                  class="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                  Voir
                </NuxtLink>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <p>Explorez notre liste d'enseignants</p>
            <NuxtLink to="/teachers" class="text-purple-600 text-sm hover:text-purple-800">
              Voir tous les enseignants
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Matières populaires -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Matières populaires</h3>
        </div>
        <div class="p-6">
          <div v-if="stats?.availableSubjects?.length" class="space-y-3">
            <div v-for="subject in stats.availableSubjects.slice(0, 6)" :key="subject._id" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              @click="exploreSubject(subject)">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">
                    {{ subject.name.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ subject.name }}</p>
                  <p class="text-sm text-gray-500">{{ subject.teacherIds?.length || 0 }} enseignants</p>
                </div>
              </div>
              <div class="text-right">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p>Aucune matière disponible</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Prochains cours -->
    <div v-if="stats?.recent?.bookings?.length" class="mt-6">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Mes prochains cours</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="booking in upcomingBookings" :key="booking._id" 
              class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-purple-600">{{ formatBookingDate(booking.startTime) }}</span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getBookingStatusClass(booking.status)">
                  {{ getBookingStatusLabel(booking.status) }}
                </span>
              </div>
              <p class="font-medium text-gray-900">{{ booking.subject || 'Cours particulier' }}</p>
              <p class="text-sm text-gray-500">avec {{ booking.teacherName || 'Enseignant' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupérer l'utilisateur et les statistiques
const { user } = useAuth();

console.log('📊 StudentDashboard - Chargement...');

// Récupérer les statistiques avec gestion d'erreur
let stats = ref(null);
let loading = ref(false);

try {
  const result = await useFetch('/api/dashboard/stats');
  stats.value = result.data.value;
  loading.value = result.pending.value;
  console.log('📊 StudentDashboard - Stats récupérées:', stats.value);
} catch (error) {
  console.error('❌ StudentDashboard - Erreur lors du chargement des stats:', error);
  stats.value = null;
}

// État local
const unreadMessages = ref(0);
const recommendedTeachers = ref([]);

// Cours à venir (exemple)
const upcomingBookings = computed(() => {
  if (!stats.value?.recent?.bookings) return [];
  return stats.value.recent.bookings.filter(booking => {
    return new Date(booking.startTime) > new Date() && booking.status === 'confirmed';
  });
});

// Méthodes utilitaires
const formatBookingDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
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
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
};

const exploreSubject = (subject) => {
  navigateTo(`/subjects/${subject._id}`);
};

// Charger les données complémentaires
onMounted(async () => {
  try {
    // Charger les enseignants recommandés
    // recommendedTeachers.value = await $fetch('/api/students/recommended-teachers');
    // unreadMessages.value = await $fetch('/api/messages/unread-count');
    
    // Enseignants d'exemple pour la démo
    recommendedTeachers.value = [
      {
        _id: '1',
        firstName: 'Marie',
        lastName: 'Dupont',
        subjects: ['Mathématiques', 'Physique'],
        rating: 4.8,
        reviewCount: 25
      },
      {
        _id: '2',
        firstName: 'Pierre',
        lastName: 'Martin',
        subjects: ['Français', 'Littérature'],
        rating: 4.9,
        reviewCount: 18
      },
      {
        _id: '3',
        firstName: 'Sophie',
        lastName: 'Bernard',
        subjects: ['Anglais', 'Espagnol'],
        rating: 4.7,
        reviewCount: 32
      }
    ];
  } catch (error) {
    console.error('Erreur lors du chargement des données complémentaires:', error);
  }
});
</script>
