<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
      <p class="text-gray-600 mt-2">Vue d'ensemble de la plateforme Academ</p>
    </div>

    <!-- Statistiques générales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Utilisateurs totaux" 
        :value="stats?.overview?.totalUsers || 0"
        icon="users"
        color="purple"
      />
      <StatsCard 
        title="Étudiants" 
        :value="stats?.overview?.totalStudents || 0"
        icon="academic-cap"
        color="purple"
      />
      <StatsCard 
        title="Enseignants" 
        :value="stats?.overview?.totalTeachers || 0"
        icon="user-group"
        color="purple"
      />
      <StatsCard 
        title="Messages" 
        :value="stats?.overview?.totalMessages || 0"
        icon="chat"
        color="purple"
      />
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 hidden">
      <!-- Gestion des utilisateurs -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h3>
        <div class="space-y-3">
          <NuxtLink to="/admin/users" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            👥 Voir tous les utilisateurs
          </NuxtLink>
          <NuxtLink to="/admin/users?filter=pending" 
            class="block w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            ⏳ Enseignants en attente ({{ pendingTeachers }})
          </NuxtLink>
          <NuxtLink to="/admin/users/create" 
            class="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
            ➕ Créer un utilisateur
          </NuxtLink>
          <NuxtLink to="/admin/create-teacher" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            👨‍🏫 Créer un professeur
          </NuxtLink>
        </div>
      </div>

      <!-- Modération -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Modération</h3>
        <div class="space-y-3">
          <NuxtLink to="/admin/reports" 
            class="block w-full text-left px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
            🚨 Signalements ({{ reportsCount }})
          </NuxtLink>
          <NuxtLink to="/admin/messages" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            💬 Surveiller les messages
          </NuxtLink>
          <NuxtLink to="/admin/reviews" 
            class="block w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors">
            ⭐ Gérer les avis
          </NuxtLink>
        </div>
      </div>

      <!-- Configuration -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
        <div class="space-y-3">
          <NuxtLink to="/admin/subjects" 
            class="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
            📚 Gérer les matières
          </NuxtLink>
          <NuxtLink to="/admin/settings" 
            class="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
            ⚙️ Paramètres système
          </NuxtLink>
          <NuxtLink to="/admin/analytics" 
            class="block w-full text-left px-4 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors">
            📊 Analytics détaillés
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contenu en deux colonnes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Utilisateurs récents -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Utilisateurs récents</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement...</p>
          </div>
          <div v-else-if="stats?.recent?.users?.length" class="space-y-4">
            <div v-for="user in stats.recent.users" :key="user._id" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 font-semibold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(user.createdAt) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            Aucun utilisateur récent
          </div>
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Aperçu détaillé</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Réservations totales</span>
              <span class="font-semibold text-gray-900">{{ stats?.overview?.totalBookings || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Matières disponibles</span>
              <span class="font-semibold text-gray-900">{{ stats?.overview?.totalSubjects || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600">Avis laissés</span>
              <span class="font-semibold text-gray-900">{{ stats?.overview?.totalReviews || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Taux d'activité</span>
              <span class="font-semibold text-purple-600">{{ activityRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupérer les statistiques
const { data: stats, pending: loading } = await useFetch('/api/dashboard/stats');

// Données réactives pour les compteurs
const pendingTeachers = ref(0);
const reportsCount = ref(0);

// Calculer le taux d'activité
const activityRate = computed(() => {
  if (!stats.value?.overview) return 0;
  const { totalUsers, totalMessages, totalBookings } = stats.value.overview;
  if (totalUsers === 0) return 0;
  return Math.round(((totalMessages + totalBookings) / totalUsers) * 10);
});

// Méthodes utilitaires
const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    teacher: 'bg-purple-100 text-purple-800',
    student: 'bg-purple-100 text-purple-800'
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Admin',
    teacher: 'Enseignant',
    student: 'Étudiant'
  };
  return labels[role] || role;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Charger les données complémentaires
onMounted(async () => {
  try {
    // Ici on pourrait ajouter d'autres appels API pour les données spécifiques
    // pendingTeachers.value = await $fetch('/api/admin/pending-teachers-count');
    // reportsCount.value = await $fetch('/api/admin/reports-count');
  } catch (error) {
    console.error('Erreur lors du chargement des données complémentaires:', error);
  }
});
</script>
