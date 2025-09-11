<template>
  <div class=" mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">My Lessons</h1>
            <p class="text-purple-100">Manage your bookings and track your progress</p>
          </div>
          <NuxtLink 
            to="/teachers" 
            class="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book a lesson
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total lessons</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalBookings || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="bg-purple-50 p-3 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Completed lessons</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.completedBookings || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Lesson hours</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.totalHours || 0 }}h</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Average rating</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats?.averageRating?.toFixed(1) || '0.0' }}/5</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher un enseignant, une matière..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        <select 
          v-model="statusFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select 
          v-model="timeFilter" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming lessons</option>
          <option value="past">Past lessons</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
        </select>
        
        <button 
          @click="resetFilters"
          class="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p class="ml-3 text-gray-600">Loading your courses...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-purple-800">Error</h3>
          <p class="text-purple-600">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Liste des cours -->
    <div v-else-if="filteredBookings.length > 0" class="space-y-6">
      <div 
        v-for="booking in filteredBookings" 
        :key="booking._id"
        class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <!-- Informations principales -->
            <div class="flex-1">
              <div class="flex items-center space-x-4 mb-4">
                                 <Avatar
                   :avatar-url="booking.teacherId?.avatar"
                   :alt="booking.teacherId?.firstName + ' ' + booking.teacherId?.lastName"
                   size="lg"
                 />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ booking.teacherId?.firstName }} {{ booking.teacherId?.lastName }}
                  </h3>
                  <p class="text-gray-600">{{ booking.subjectId?.name || 'Private lesson' }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-600">{{ formatDate(booking.startTime) }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-gray-600">{{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span class="text-gray-600">{{ booking.hourlyRate || 0 }}€/h</span>
                </div>
              </div>
              
              <div v-if="booking.notes" class="bg-gray-50 rounded-lg p-3 mb-4">
                <p class="text-sm text-gray-700">{{ booking.notes }}</p>
              </div>
            </div>
            
            <!-- Status and actions -->
            <div class="flex flex-col items-end space-y-3">
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(booking.status)"
              >
                {{ getStatusLabel(booking.status) }}
              </span>
              
              <div class="flex space-x-2">
                <!-- Actions based on status -->
                <button 
                  v-if="booking.status === 'pending'"
                  @click="cancelBooking(booking._id)"
                  :disabled="cancelling === booking._id"
                  class="px-3 py-1 text-sm text-purple-400 hover:text-purple-600 disabled:opacity-50"
                >
                  <span v-if="cancelling === booking._id" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Annulation...
                  </span>
                  <span v-else>Cancel</span>
                </button>
                
                <button 
                  v-if="booking.status === 'completed' && !booking.hasReview"
                  @click="openReviewModal(booking)"
                  class="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                >
                  Laisser un avis
                </button>
                
                <button 
                  @click="openMessageModal(booking)"
                  class="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                >
                  Message
                </button>
                
                <button 
                  @click="viewDetails(booking)"
                  class="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                >
                  Détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery || statusFilter !== 'all' || timeFilter !== 'all' 
            ? 'No lessons match your search criteria.' 
            : 'You haven\'t booked any lessons yet.' }}
        </p>
        <NuxtLink 
          to="/teachers" 
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Find a teacher
        </NuxtLink>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <nav class="flex items-center space-x-2">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        
        <div class="flex space-x-1">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm rounded-lg',
              page === currentPage 
                ? 'bg-purple-600 text-white' 
                : 'border border-purple-200 text-purple-600 hover:bg-purple-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
// L'authentification est gérée par le middleware global

// État réactif
const loading = ref(true);
const error = ref(null);
const bookings = ref([]);
const stats = ref(null);
const cancelling = ref(null);

// Filters
const searchQuery = ref('');
const statusFilter = ref('all');
const timeFilter = ref('all');

// Pagination
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 10;

// Computed properties
const filteredBookings = computed(() => {
  let filtered = bookings.value;

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(booking => 
      booking.teacherId?.firstName?.toLowerCase().includes(query) ||
      booking.teacherId?.lastName?.toLowerCase().includes(query) ||
      booking.subjectId?.name?.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(booking => booking.status === statusFilter.value);
  }

  // Filtre par temps
  if (timeFilter.value !== 'all') {
    const now = new Date();
    filtered = filtered.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      
      switch (timeFilter.value) {
        case 'upcoming':
          return bookingDate > now;
        case 'past':
          return bookingDate < now;
        case 'today':
          const today = new Date();
          return bookingDate.toDateString() === today.toDateString();
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return bookingDate >= now && bookingDate <= weekFromNow;
        default:
          return true;
      }
    });
  }

  return filtered;
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-purple-100 text-purple-700',
    confirmed: 'bg-purple-200 text-purple-800',
    completed: 'bg-purple-50 text-purple-600',
    cancelled: 'bg-gray-100 text-gray-600'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return labels[status] || status;
};

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
  timeFilter.value = 'all';
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadBookings();
  }
};

// Actions
const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this class?')) {
    return;
  }

  try {
    cancelling.value = bookingId;
    
    await $fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });
    
    // Recharger les données
    await loadBookings();
    
    // Afficher une notification de succès
    // TODO: Intégrer le système de notifications
  } catch (err) {
    console.error('Erreur lors de l\'annulation:', err);
    error.value = 'Erreur lors de l\'annulation du cours';
  } finally {
    cancelling.value = null;
  }
};

const openReviewModal = (booking) => {
  // TODO: Implémenter la modal d'avis
  console.log('Ouvrir modal avis pour:', booking);
};

const openMessageModal = (booking) => {
  // TODO: Implémenter la modal de message
  console.log('Ouvrir modal message pour:', booking);
};

const viewDetails = (booking) => {
  // TODO: Naviguer vers la page de détails
  console.log('Voir détails pour:', booking);
};

// Charger les données
const loadBookings = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await $fetch('/api/students/bookings', {
      query: {
        page: currentPage.value,
        limit: itemsPerPage,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
        search: searchQuery.value || undefined
      }
    });
    
    bookings.value = response.bookings || [];
    stats.value = response.stats || {};
    totalPages.value = response.totalPages || 1;
  } catch (err) {
    console.error('Erreur lors du chargement des cours:', err);
    error.value = err.data?.message || 'Erreur lors du chargement des cours';
  } finally {
    loading.value = false;
  }
};

// Charger les données au montage
onMounted(() => {
  loadBookings();
});

// Reload when filters change
watch([searchQuery, statusFilter, timeFilter], () => {
  currentPage.value = 1;
  loadBookings();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
