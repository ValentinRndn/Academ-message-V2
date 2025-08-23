<template>
  <div class="space-y-6">
    <!-- Mode édition -->
    <div v-if="isEditing" class="space-y-6">
      <!-- Sélection des jours -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Jours de disponibilité</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label 
            v-for="day in daysOfWeek" 
            :key="day.value"
            class="relative flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
            :class="{ 'border-indigo-500 bg-indigo-50': availableDays.includes(day.value) }"
          >
            <input
              type="checkbox"
              :value="day.value"
              v-model="availableDays"
              class="sr-only"
            />
            <div class="flex items-center space-x-3">
              <div 
                class="w-5 h-5 rounded border-2 flex items-center justify-center"
                :class="availableDays.includes(day.value) ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'"
              >
                <svg v-if="availableDays.includes(day.value)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="font-medium text-gray-900">{{ day.label }}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Créneaux horaires -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Créneaux horaires</h3>
        <div class="space-y-4">
          <div 
            v-for="(slot, index) in timeSlots" 
            :key="index"
            class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  v-model="slot.startTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                <input
                  type="time"
                  v-model="slot.endTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              @click="removeTimeSlot(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              :disabled="timeSlots.length === 1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <button
            @click="addTimeSlot"
            class="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Ajouter un créneau</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="saveAvailability"
          :disabled="!canSave"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sauvegarder
        </button>
      </div>
    </div>

    <!-- Mode affichage -->
    <div v-else class="space-y-6">
      <!-- Aperçu des disponibilités -->
      <div v-if="availability.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Vos disponibilités actuelles</h3>
          <button
            @click="startEdit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Modifier
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(dayGroup, dayName) in groupedAvailability" 
            :key="dayName"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <h4 class="font-medium text-gray-900 mb-3">{{ dayName }}</h4>
            <div class="space-y-2">
              <div 
                v-for="slot in dayGroup" 
                :key="`${dayName}-${slot.startTime}-${slot.endTime}`"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm text-gray-700">
                  {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ getDuration(slot.startTime, slot.endTime) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune disponibilité définie</h3>
        <p class="mt-1 text-sm text-gray-500">
          Définissez vos créneaux de disponibilité pour que les étudiants puissent réserver des cours.
        </p>
        <div class="mt-6">
          <button
            @click="startEdit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Définir mes disponibilités
          </button>
        </div>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="text-sm text-gray-500 mt-2">Chargement...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  teacherId: {
    type: String,
    required: true
  }
});

// État réactif
const isEditing = ref(false);
const loading = ref(false);
const availableDays = ref([]);
const timeSlots = ref([{ startTime: '09:00', endTime: '10:00' }]);
const availability = ref([]);

// Jours de la semaine (0 = dimanche, 1 = lundi, etc.)
const daysOfWeek = [
  { value: 'sunday', label: 'Dimanche' },
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' }
];

// Computed properties
const canSave = computed(() => {
  return availableDays.value.length > 0 && 
         timeSlots.value.length > 0 && 
         timeSlots.value.every(slot => slot.startTime && slot.endTime && slot.startTime < slot.endTime);
});

const groupedAvailability = computed(() => {
  const grouped = {};
  
  availability.value.forEach(slot => {
    const dayName = daysOfWeek[slot.dayOfWeek]?.label;
    if (dayName) {
      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(slot);
    }
  });
  
  return grouped;
});

// Méthodes
const addTimeSlot = () => {
  timeSlots.value.push({ startTime: '09:00', endTime: '10:00' });
};

const removeTimeSlot = (index) => {
  if (timeSlots.value.length > 1) {
    timeSlots.value.splice(index, 1);
  }
};

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  loadAvailability();
};

const saveAvailability = async () => {
  try {
    loading.value = true;
    
    const availability = [];
    availableDays.value.forEach(day => {
      timeSlots.value.forEach(slot => {
        const dayOfWeek = daysOfWeek.findIndex(d => d.value === day);
        availability.push({
          dayOfWeek: dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      });
    });

    console.log('Saving availability:', availability);
    
    const response = await $fetch('/api/teachers/availability', {
      method: 'PUT',
      body: { availability },
      credentials: 'include'
    });

    console.log('Availability saved successfully:', response);
    
    // Afficher une notification de succès
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Disponibilités sauvegardées avec succès', 'success');
    }
    
    // Émettre un événement pour informer les autres composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('availability-updated'));
    }
    
    isEditing.value = false;
    await loadAvailability();
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des disponibilités:', error);
    
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Erreur lors de la sauvegarde des disponibilités', 'error');
    }
  } finally {
    loading.value = false;
  }
};

const loadAvailability = async () => {
  try {
    loading.value = true;
    
    console.log('TeacherAvailability component mounted for teacher ID:', props.teacherId);
    
    const response = await $fetch('/api/teachers/availability', {
      credentials: 'include'
    });

    if (response.availability && response.availability.length > 0) {
      availability.value = response.availability;
      
      // Reconstruire les données d'édition
      const daysSet = new Set();
      const slotsMap = new Map();
      
      response.availability.forEach(slot => {
        const dayName = daysOfWeek[slot.dayOfWeek]?.value;
        if (dayName) {
          daysSet.add(dayName);
          const slotKey = `${slot.startTime}-${slot.endTime}`;
          if (!slotsMap.has(slotKey)) {
            slotsMap.set(slotKey, { startTime: slot.startTime, endTime: slot.endTime });
          }
        }
      });
      
      availableDays.value = Array.from(daysSet);
      timeSlots.value = Array.from(slotsMap.values());
    } else {
      availability.value = [];
      availableDays.value = [];
      timeSlots.value = [{ startTime: '09:00', endTime: '10:00' }];
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des disponibilités:', error);
    availability.value = [];
  } finally {
    loading.value = false;
  }
};

const formatTime = (time) => {
  return time;
};

const getDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h${diffMinutes > 0 ? diffMinutes : ''}`;
  } else {
    return `${diffMinutes}min`;
  }
};

// Lifecycle
onMounted(() => {
  loadAvailability();
});
</script>
