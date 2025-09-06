<template>
  <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <div class="teacher-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          </div>
        </div>
        
    <!-- Teacher profile -->
    <div v-else-if="teacher" class="bg-white shadow-lg rounded-xl overflow-hidden">
      <!-- Header section -->
      <div class="relative h-48 bg-purple-600">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-600 opacity-90"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div class="flex items-end">
            <div class="relative">
              <Avatar
                :avatar-url="teacher.avatar"
                  :alt="`${teacher.firstName} ${teacher.lastName}`" 
                size="xl"
                :online="teacher.isAvailableNow"
                />
              </div>
            <div class="ml-6 pb-2">
              <h1 class="text-3xl font-bold">{{ teacher.firstName }} {{ teacher.lastName }}</h1>
              <div class="flex items-center mt-2">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                <span class="ml-2 text-white">
                  {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'Pas encore noté' }}
                  <span v-if="teacher.reviewCount">({{ teacher.reviewCount }} avis)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      <!-- Main content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left column: Info and subjects -->
          <div class="md:col-span-2 space-y-6">
            <!-- Bio -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
              <p class="text-gray-600">{{ teacher.bio || 'Aucune biographie disponible.' }}</p>
          </div>
          
            <!-- Subjects -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Matières enseignées</h2>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="subject in teacher.subjects" 
                  :key="subject._id"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {{ subject.name }}
                  </span>
                </div>
              </div>
              
            <!-- Experience and languages -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Expérience et langues</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                    <span class="font-medium">{{ teacher.experience }}+ ans d'expérience</span>
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span class="font-medium">
                      {{ teacher.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') }}
                  </span>
                </div>
                      </div>
                    </div>
                  </div>
                  
            <!-- Availability -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Disponibilités</h2>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="day in availabilityByDay" :key="day.name" class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-900 mb-2">{{ day.name }}</h3>
                  <div v-if="day.slots.length > 0" class="space-y-1">
                    <div v-for="(slot, index) in day.slots" :key="index" class="text-sm text-gray-600">
                      {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
                            </div>
                          </div>
                  <div v-else class="text-sm text-gray-500">
                    Non disponible
                        </div>
                  </div>
                </div>
              </div>
            </div>
            
          <!-- Right column: Booking and contact -->
          <div class="space-y-6">
            <!-- Price card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div class="flex justify-between items-baseline mb-4">
                    <div>
                  <span class="text-3xl font-bold text-gray-900">${{ teacher.hourlyRate }}</span>
                  <span class="text-sm text-gray-500">/heure</span>
                      </div>
                <span v-if="teacher.isAvailableNow" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponible maintenant
                </span>
                </div>
                
                  <button 
                class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mb-4"
                @click="bookLesson"
                  >
                Réserver un cours
                  </button>
                
                <button 
                class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                @click="contactTeacher"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                Contacter
                </button>
              </div>
              
            <!-- Member since -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Membre depuis</span>
                <span class="font-medium text-gray-900">{{ formatDate(teacher.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    <!-- Modale de réservation -->
    <BookingModal
      :is-open="showBookingModal"
      :teacher="teacher"
      @close="showBookingModal = false"
      @booking-created="onBookingCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTeachers } from '~/composables/useTeachers';

const route = useRoute();
const router = useRouter();
const { fetchTeacherById } = useTeachers();

const teacher = ref(null);
const loading = ref(true);
const error = ref(null);

// Charger les données du professeur
onMounted(async () => {
  try {
    const teacherId = route.params.id;
    const data = await fetchTeacherById(teacherId);
    
    if (!data) {
      error.value = 'Professeur non trouvé';
      return;
    }
    
    teacher.value = data;
  } catch (err) {
    console.error('Error fetching teacher:', err);
    error.value = 'Erreur lors du chargement des informations du professeur';
  } finally {
    loading.value = false;
  }
});

// Formater les disponibilités par jour
const availabilityByDay = computed(() => {
  if (!teacher.value?.availability) return [];
  
  const days = [
    { name: 'Lundi', dayOfWeek: 1, slots: [] },
    { name: 'Mardi', dayOfWeek: 2, slots: [] },
    { name: 'Mercredi', dayOfWeek: 3, slots: [] },
    { name: 'Jeudi', dayOfWeek: 4, slots: [] },
    { name: 'Vendredi', dayOfWeek: 5, slots: [] },
    { name: 'Samedi', dayOfWeek: 6, slots: [] },
    { name: 'Dimanche', dayOfWeek: 0, slots: [] }
  ];
  
  // Regrouper les créneaux par jour
  teacher.value.availability.forEach(slot => {
    const day = days.find(d => d.dayOfWeek === slot.dayOfWeek);
    if (day) {
      day.slots.push(slot);
    }
  });
  
  // Trier les créneaux par heure de début
  days.forEach(day => {
    day.slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });
  
  return days;
});

// Formatage des dates et heures
const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric', 
    month: 'long'
  });
};

// État pour la réservation
const showBookingModal = ref(false);
const selectedSlot = ref(null);
const bookingLoading = ref(false);

// Actions
const bookLesson = () => {
  showBookingModal.value = true;
};

const contactTeacher = async () => {
  try {
    if (!teacher.value) return;

    // Vérifier si l'utilisateur est connecté
    const { user, initAuth } = useAuth();
    const isAuthenticated = await initAuth();
    
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
      return;
    }

    // Créer ou trouver une conversation avec ce professeur
    console.log('🔍 Données du professeur:', teacher.value);
    console.log('🔍 Tentative d\'appel API avec participantId:', teacher.value.userId);
    
    try {
      const response = await $fetch('/api/messages/start-conversation', {
        method: 'POST',
        body: {
          participantId: teacher.value.userId // Utiliser l'userId du Teacher
        },
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Réponse API:', response);
      
      if (response && response.conversation) {
        // Rediriger vers la page de messages avec cette conversation
        router.push(`/messages?conversation=${response.conversation._id}`);
      }
    } catch (fetchError) {
      console.error('❌ Erreur fetch:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    
    // Si c'est une erreur 401, rediriger vers la connexion
    if (error.statusCode === 401) {
      router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
      return;
    }
    
    // TODO: Afficher une notification d'erreur à l'utilisateur
  }
};

// Gérer la création d'une réservation
const onBookingCreated = (booking) => {
  console.log('Réservation créée avec succès:', booking);
  // La redirection vers le paiement est gérée dans la modale
};
</script>

<style scoped>
.teacher-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-loader div {
  width: 16px;
  height: 16px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: #6366F1;
  animation: teacher-loader 1.5s infinite ease-in-out both;
}

.teacher-loader div:nth-child(1) {
  animation-delay: -0.3s;
}

.teacher-loader div:nth-child(2) {
  animation-delay: -0.15s;
}

@keyframes teacher-loader {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}
</style>