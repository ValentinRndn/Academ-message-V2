<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage My Availability</h1>
        <p class="mt-2 text-gray-600">
          Set your availability slots so students can book lessons.
        </p>
      </div>

      <!-- TeacherAvailability Component -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
        <TeacherAvailability :teacherId="'current'" />
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-3">💡 How does it work?</h3>
        <div class="space-y-2 text-sm text-purple-800">
          <p>• <strong>Select the days</strong> when you are available</p>
          <p>• <strong>Set your time slots</strong> for each day</p>
          <p>• <strong>Save</strong> your availability</p>
          <p>• Students will be able to <strong>see and book</strong> only these slots</p>
          <p>• Already booked slots will be <strong>automatically blocked</strong></p>
        </div>
      </div>

      <!-- Preview -->
      <div class="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Preview of Your Availability</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading...</p>
          </div>
          
          <div v-else-if="availability.length > 0" class="grid grid-cols-7 gap-4">
            <div v-for="day in availabilityByDay" :key="day.name" class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-3">{{ day.name }}</h4>
              <div v-if="day.slots.length > 0" class="space-y-2">
                <div v-for="(slot, index) in day.slots" :key="index" 
                     class="text-sm bg-white p-2 rounded border">
                  {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                Not available
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2">No availability defined</p>
            <p class="text-sm">Use the form above to set your time slots</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Définir les métadonnées de la page
definePageMeta({
});

// État
const availability = ref([]);
const loading = ref(true);

// Format availability by day
const availabilityByDay = computed(() => {
  const days = [
    { name: 'Sunday', dayOfWeek: 0, slots: [] },
    { name: 'Monday', dayOfWeek: 1, slots: [] },
    { name: 'Tuesday', dayOfWeek: 2, slots: [] },
    { name: 'Wednesday', dayOfWeek: 3, slots: [] },
    { name: 'Thursday', dayOfWeek: 4, slots: [] },
    { name: 'Friday', dayOfWeek: 5, slots: [] },
    { name: 'Saturday', dayOfWeek: 6, slots: [] }
  ];
  
  // Group slots by day
  availability.value.forEach(slot => {
    const day = days.find(d => d.dayOfWeek === slot.dayOfWeek);
    if (day) {
      day.slots.push(slot);
    }
  });
  
  // Sort slots by start time
  days.forEach(day => {
    day.slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });
  
  return days;
});

// Formatage des heures
const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load availability
const loadAvailability = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/teachers/availability', {
      credentials: 'include'
    });
    availability.value = response.availability || [];
  } catch (error) {
    console.error('Error loading availability:', error);
  } finally {
    loading.value = false;
  }
};

// Listen for availability changes from component
const handleAvailabilityUpdated = () => {
  loadAvailability();
};

// Lifecycle
onMounted(() => {
  loadAvailability();
  
  // Écouter les événements de mise à jour
  window.addEventListener('availability-updated', handleAvailabilityUpdated);
});

onUnmounted(() => {
  window.removeEventListener('availability-updated', handleAvailabilityUpdated);
});
</script>
