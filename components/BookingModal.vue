<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <span class="text-purple-600 font-medium text-lg">
                {{ teacher?.firstName?.charAt(0) }}{{ teacher?.lastName?.charAt(0) }}
              </span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                Réserver un cours avec {{ teacher?.firstName }} {{ teacher?.lastName }}
              </h2>
              <p class="text-gray-600">{{ teacher?.hourlyRate }}€/heure + 5€ de commission</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="space-y-6">
          <!-- Sélection de la matière -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Matière *
            </label>
            <select
              v-model="selectedSubject"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Sélectionnez une matière</option>
              <option
                v-for="subject in teacher?.subjects"
                :key="subject._id"
                :value="subject._id"
              >
                {{ subject.name }}
              </option>
              <!-- Debug: afficher les matières si aucune n'apparaît -->
              <option v-if="!teacher?.subjects || teacher.subjects.length === 0" disabled>
                Aucune matière disponible
              </option>
            </select>
          </div>

          <!-- Sélection de la date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              v-model="selectedDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <!-- Sélection de l'heure de début -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Heure de début *
              </label>
              
              <div v-if="loadingSlots" class="text-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">Chargement des créneaux...</p>
              </div>
              
              <div v-else-if="availableSlots.length > 0">
                <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  <button
                    v-for="slot in availableSlots"
                    :key="slot.startTime"
                    @click="selectSlot(slot)"
                    :class="[
                      'px-3 py-2 text-sm rounded-md border transition-colors',
                      selectedStartTime === slot.formattedStartTime
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ slot.formattedStartTime }}
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  {{ availableSlots.length }} créneau{{ availableSlots.length > 1 ? 'x' : '' }} disponible{{ availableSlots.length > 1 ? 's' : '' }}
                </p>
              </div>
              
              <div v-else class="text-center py-4 border border-gray-300 rounded-lg">
                <p class="text-sm text-gray-500">
                  Aucun créneau disponible pour cette date
                </p>
              </div>
            </div>

            <!-- Durée -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Durée *
              </label>
              <select
                v-model="selectedDuration"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Choisir</option>
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h 30</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
              </select>
            </div>
          </div>

          <!-- Heure de fin (calculée automatiquement) -->
          <div v-if="calculatedEndTime">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Heure de fin
            </label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {{ calculatedEndTime }}
            </div>
          </div>

          <!-- Résumé du coût -->
          <div v-if="calculatedCost" class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-medium text-purple-900 mb-2">Résumé du coût</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Cours ({{ selectedDuration }} min)</span>
                <span>{{ calculatedCost.teacherAmount }}€</span>
              </div>
              <div class="flex justify-between">
                <span>Commission plateforme</span>
                <span>5€</span>
              </div>
              <div class="flex justify-between font-semibold text-purple-900 pt-2 border-t border-purple-200">
                <span>Total</span>
                <span>{{ calculatedCost.totalAmount }}€</span>
              </div>
            </div>
          </div>

          <!-- Notes optionnelles -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              v-model="studentNotes"
              rows="3"
              placeholder="Décrivez vos objectifs pour ce cours, votre niveau, ou toute information utile..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              maxlength="500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ studentNotes.length }}/500 caractères</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            :disabled="loading"
          >
            Annuler
          </button>
          <button
            @click="createBooking"
            :disabled="!isFormValid || loading"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Création...' : 'Réserver et payer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from '~/composables/useToast';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  teacher: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'booking-created']);

const { showSuccess, showError } = useToast();

// État du formulaire
const selectedSubject = ref('');
const selectedDate = ref('');
const selectedStartTime = ref('');
const selectedDuration = ref('');
const studentNotes = ref('');
const loading = ref(false);

// Dates limites
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 60); // 2 mois à l'avance
  return futureDate.toISOString().split('T')[0];
});

// Créneaux disponibles récupérés depuis l'API
const availableSlots = ref([]);
const loadingSlots = ref(false);

// Récupérer les créneaux disponibles pour la date sélectionnée
const fetchAvailableSlots = async () => {
  if (!selectedDate.value || !props.teacher?._id) return;
  
  try {
    loadingSlots.value = true;
    
    const response = await $fetch(`/api/teachers/${props.teacher._id}/available-slots`, {
      query: {
        date: selectedDate.value,
        duration: selectedDuration.value || 60
      },
      credentials: 'include'
    });
    
    availableSlots.value = response.availableSlots || [];
    console.log('Créneaux disponibles:', availableSlots.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    availableSlots.value = [];
  } finally {
    loadingSlots.value = false;
  }
};

// Surveiller les changements de date et durée
watch([selectedDate, selectedDuration], () => {
  if (selectedDate.value) {
    fetchAvailableSlots();
  }
});

// Créneaux horaires disponibles (fallback si pas d'API)
const availableStartTimes = computed(() => {
  if (availableSlots.value.length > 0) {
    return availableSlots.value.map(slot => slot.formattedStartTime);
  }
  
  // Fallback : créneaux génériques
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
});

// Heure de fin calculée
const calculatedEndTime = computed(() => {
  if (!selectedStartTime.value || !selectedDuration.value) return null;
  
  const [hours, minutes] = selectedStartTime.value.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + parseInt(selectedDuration.value);
  
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
});

// Calcul du coût
const calculatedCost = computed(() => {
  if (!selectedDuration.value || !props.teacher?.hourlyRate) return null;
  
  const durationInHours = parseInt(selectedDuration.value) / 60;
  const teacherAmount = Math.round(durationInHours * props.teacher.hourlyRate * 100) / 100;
  const totalAmount = Math.round((teacherAmount + 5) * 100) / 100; // +5€ commission
  
  return {
    teacherAmount,
    totalAmount,
    commission: 5
  };
});

// Validation du formulaire
const isFormValid = computed(() => {
  return selectedSubject.value &&
         selectedDate.value &&
         selectedStartTime.value &&
         selectedDuration.value;
});

// Sélectionner un créneau
const selectSlot = (slot) => {
  selectedStartTime.value = slot.formattedStartTime;
  selectedDuration.value = slot.duration.toString();
};

// Fermer la modale
const closeModal = () => {
  emit('close');
  resetForm();
};

// Réinitialiser le formulaire
const resetForm = () => {
  selectedSubject.value = '';
  selectedDate.value = '';
  selectedStartTime.value = '';
  selectedDuration.value = '';
  studentNotes.value = '';
};

// Créer la réservation
const createBooking = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  
  try {
    // Construire les dates complètes
    const startDateTime = new Date(`${selectedDate.value}T${selectedStartTime.value}:00`);
    const endDateTime = new Date(`${selectedDate.value}T${calculatedEndTime.value}:00`);
    
    // Données de la réservation
    const bookingData = {
      teacherId: props.teacher._id,
      subjectId: selectedSubject.value,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      studentNotes: studentNotes.value
    };
    
    console.log('Création de la réservation:', bookingData);
    
    // Créer la réservation via l'API
    const booking = await $fetch('/api/bookings/create', {
      method: 'POST',
      body: bookingData,
      credentials: 'include'
    });
    
    console.log('Réservation créée:', booking);
    
    showSuccess(
      'Réservation créée !', 
      'Votre cours a été réservé. Procédez maintenant au paiement.',
      5000
    );
    
    // Émettre l'événement avec les données de la réservation
    emit('booking-created', booking.booking);
    closeModal();
    
    // Rediriger vers la page de paiement
    await navigateTo(`/payment?booking=${booking.booking._id}`);
    
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    showError(
      'Erreur de réservation',
      error.data?.message || 'Impossible de créer la réservation. Veuillez réessayer.',
      10000
    );
  } finally {
    loading.value = false;
  }
};

// Surveiller l'ouverture de la modale pour réinitialiser le formulaire
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm();
    // Debug: afficher les données du professeur
    console.log('Teacher data in BookingModal:', props.teacher);
    console.log('Teacher subjects:', props.teacher?.subjects);
  }
});
</script>

<style scoped>
/* Animation pour l'ouverture de la modale */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-white {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
