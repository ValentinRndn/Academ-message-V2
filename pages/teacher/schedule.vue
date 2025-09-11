<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mon Planning</h1>
        <p class="mt-2 text-gray-600">
          Gérez vos cours et vos disponibilités en un seul endroit.
        </p>
      </div>

      <!-- Navigation des onglets -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
        <!-- Onglet Disponibilités -->
        <div v-if="activeTab === 'availability'" class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Gérer mes disponibilités</h2>
            <p class="text-gray-600">Définissez vos créneaux de disponibilité pour que les étudiants puissent réserver des cours.</p>
          </div>
          <TeacherAvailability :teacherId="'current'" />
        </div>


        <!-- Onglet Cours programmés -->
        <div v-if="activeTab === 'bookings'" class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Mes cours programmés</h2>
            <p class="text-gray-600">Consultez et gérez vos réservations de cours.</p>
          </div>
          
          <!-- Filtres -->
          <div class="mb-6 flex flex-wrap gap-4">
            <select v-model="bookingFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="all">Tous les cours</option>
              <option value="upcoming">Cours à venir</option>
              <option value="past">Cours passés</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmés</option>
            </select>
            
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un étudiant ou une matière..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex-1 min-w-64"
            />
          </div>

          <!-- Liste des cours -->
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement des cours...</p>
          </div>

          <div v-else-if="filteredBookings.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-gray-500">Aucun cours trouvé</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="booking in filteredBookings" 
              :key="booking._id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="font-medium text-gray-900">{{ booking.subject }}</h3>
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getStatusClass(booking.status)
                      ]"
                    >
                      {{ getStatusText(booking.status) }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Étudiant :</span> {{ booking.studentName }}
                    </div>
                    <div>
                      <span class="font-medium">Date :</span> {{ formatDate(booking.startTime) }}
                    </div>
                    <div>
                      <span class="font-medium">Heure :</span> {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}
                    </div>
                  </div>

                  <div v-if="booking.notes" class="mt-3 p-3 bg-gray-50 rounded-lg">
                    <span class="font-medium text-gray-700">Notes :</span>
                    <p class="text-gray-600 mt-1">{{ booking.notes }}</p>
                  </div>
                </div>

                                  <div class="flex space-x-2 ml-4">
                    <button 
                      v-if="booking.status === 'pending'"
                      @click="confirmBooking(booking._id)"
                      class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Confirmer
                    </button>
                    <button 
                      v-if="booking.status === 'pending'"
                      @click="cancelBooking(booking._id)"
                      class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Refuser
                    </button>
                    <button 
                      v-if="booking.status === 'confirmed' && isUpcoming(booking.startTime)"
                      @click="sendReminder(booking._id)"
                      class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                    >
                      Rappel
                    </button>
                    <button 
                      @click="viewBookingDetails(booking)"
                      class="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Détails
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Calendrier -->
        <div v-if="activeTab === 'calendar'" class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Vue calendrier</h2>
            <p class="text-gray-600">Visualisez vos cours dans un calendrier mensuel.</p>
          </div>
          
          <!-- Navigation du calendrier -->
          <div class="flex items-center justify-between mb-6">
            <button 
              @click="previousMonth"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 class="text-lg font-medium text-gray-900">
              {{ currentMonthName }} {{ currentYear }}
            </h3>
            
            <button 
              @click="nextMonth"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Calendrier -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <!-- En-têtes des jours -->
            <div class="grid grid-cols-7 bg-gray-50">
              <div 
                v-for="day in weekDays" 
                :key="day"
                class="px-3 py-2 text-sm font-medium text-gray-700 text-center"
              >
                {{ day }}
              </div>
            </div>

            <!-- Grille du calendrier -->
            <div class="grid grid-cols-7">
              <div 
                v-for="day in calendarDays" 
                :key="day.date"
                :class="[
                  'min-h-24 p-2 border-r border-b border-gray-200',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  day.isToday ? 'bg-purple-50' : ''
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <span 
                    :class="[
                      'text-sm font-medium',
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      day.isToday ? 'text-purple-600' : ''
                    ]"
                  >
                    {{ day.dayNumber }}
                  </span>
                </div>

                <!-- Événements du jour -->
                <div class="space-y-1">
                  <div 
                    v-for="booking in getBookingsForDay(day.date)"
                    :key="booking._id"
                    :class="[
                      'px-2 py-1 text-xs rounded truncate cursor-pointer',
                      getBookingClass(booking.status)
                    ]"
                    @click="viewBookingDetails(booking)"
                    :title="`${booking.subject} - ${booking.studentName}`"
                  >
                    {{ booking.subject }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Pas de middleware pour le test
// definePageMeta({
// });

// Récupérer l'utilisateur
const { user } = useAuth();

// État réactif
const activeTab = ref('availability');
const loading = ref(false);
const bookings = ref([]);
const bookingFilter = ref('all');
const searchQuery = ref('');
const currentDate = ref(new Date());

// Onglets
const tabs = [
  {
    id: 'availability',
    name: 'Disponibilités',
    icon: 'ClockIcon'
  },
  {
    id: 'bookings',
    name: 'Cours programmés',
    icon: 'CalendarIcon'
  },
  {
    id: 'calendar',
    name: 'Calendrier',
    icon: 'CalendarDaysIcon'
  }
];

// Icônes (simplifiées)
const ClockIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' };
const CalendarIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' };
const CalendarDaysIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>' };

// Jours de la semaine
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Computed properties
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', { month: 'long' });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const filteredBookings = computed(() => {
  let filtered = bookings.value;

  // Filtre par statut
  if (bookingFilter.value !== 'all') {
    filtered = filtered.filter(booking => {
      switch (bookingFilter.value) {
        case 'upcoming':
          return new Date(booking.startTime) > new Date();
        case 'past':
          return new Date(booking.startTime) < new Date();
        case 'pending':
          return booking.status === 'pending';
        case 'confirmed':
          return booking.status === 'confirmed';
        default:
          return true;
      }
    });
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(booking => 
      booking.subject.toLowerCase().includes(query) ||
      booking.studentName.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - (firstDay.getDay() || 7) + 1);
  
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (7 - lastDay.getDay()));
  
  const days = [];
  const today = new Date();
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    days.push({
      date: new Date(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString()
    });
  }
  
  return days;
});

// Méthodes
const loadBookings = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/bookings/teacher', {
      credentials: 'include'
    });
    bookings.value = response.bookings || [];
  } catch (error) {
    console.error('Erreur lors du chargement des cours:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'confirmed': return 'Confirmé';
    case 'pending': return 'En attente';
    case 'cancelled': return 'Annulé';
    case 'completed': return 'Terminé';
    default: return status;
  }
};

const getBookingClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-200 text-green-800';
    case 'pending': return 'bg-yellow-200 text-yellow-800';
    case 'cancelled': return 'bg-red-200 text-red-800';
    case 'completed': return 'bg-purple-200 text-purple-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getBookingsForDay = (date) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= dayStart && bookingDate <= dayEnd;
  });
};

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const confirmBooking = async (bookingId) => {
  try {
    await $fetch(`/api/bookings/${bookingId}/confirm`, {
      method: 'PUT',
      credentials: 'include'
    });
    await loadBookings();
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error);
  }
};

const cancelBooking = async (bookingId) => {
  try {
    await $fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      credentials: 'include'
    });
    await loadBookings();
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
  }
};

const viewBookingDetails = (booking) => {
  // TODO: Implémenter la modal de détails
  console.log('Détails de la réservation:', booking);
};

const isUpcoming = (startTime) => {
  const now = new Date();
  const courseTime = new Date(startTime);
  return courseTime > now;
};

const sendReminder = async (bookingId) => {
  try {
    const response = await $fetch('/api/bookings/reminders', {
      method: 'POST',
      body: { bookingId, reminderType: 'hour' },
      credentials: 'include'
    });
    
    console.log('Rappel envoyé:', response);
    
    // Afficher une notification de succès
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Rappel envoyé avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du rappel:', error);
    
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Erreur lors de l\'envoi du rappel', 'error');
    }
  }
};

// Fonction de test
const testAuth = () => {
  console.log('Test d\'authentification...');
  console.log('Utilisateur:', user.value);
  alert(`Utilisateur: ${user.value ? user.value.firstName + ' ' + user.value.lastName : 'Non connecté'}`);
};

// Lifecycle
onMounted(() => {
  loadBookings();
});

console.log('Page de planning chargée');
console.log('Utilisateur:', user.value);
</script>
