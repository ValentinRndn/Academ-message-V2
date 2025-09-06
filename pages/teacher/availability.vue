<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gérer mes disponibilités</h1>
        <p class="mt-2 text-gray-600">
          Définissez vos créneaux de disponibilité pour que les étudiants puissent réserver des cours.
        </p>
      </div>

      <!-- TeacherAvailability Component -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
        <TeacherAvailability :teacherId="'current'" />
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-3">💡 Comment ça marche ?</h3>
        <div class="space-y-2 text-sm text-purple-800">
          <p>• <strong>Sélectionnez les jours</strong> où vous êtes disponible</p>
          <p>• <strong>Définissez vos créneaux horaires</strong> pour chaque jour</p>
          <p>• <strong>Sauvegardez</strong> vos disponibilités</p>
          <p>• Les étudiants pourront <strong>voir et réserver</strong> uniquement ces créneaux</p>
          <p>• Les créneaux déjà réservés seront <strong>automatiquement bloqués</strong></p>
        </div>
      </div>

      <!-- Preview -->
      <div class="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Aperçu de vos disponibilités</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement...</p>
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
                Non disponible
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2">Aucune disponibilité définie</p>
            <p class="text-sm">Utilisez le formulaire ci-dessus pour définir vos créneaux</p>
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

// Formater les disponibilités par jour
const availabilityByDay = computed(() => {
  const days = [
    { name: 'Dimanche', dayOfWeek: 0, slots: [] },
    { name: 'Lundi', dayOfWeek: 1, slots: [] },
    { name: 'Mardi', dayOfWeek: 2, slots: [] },
    { name: 'Mercredi', dayOfWeek: 3, slots: [] },
    { name: 'Jeudi', dayOfWeek: 4, slots: [] },
    { name: 'Vendredi', dayOfWeek: 5, slots: [] },
    { name: 'Samedi', dayOfWeek: 6, slots: [] }
  ];
  
  // Regrouper les créneaux par jour
  availability.value.forEach(slot => {
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

// Formatage des heures
const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Charger les disponibilités
const loadAvailability = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/teachers/availability', {
      credentials: 'include'
    });
    availability.value = response.availability || [];
  } catch (error) {
    console.error('Erreur lors du chargement des disponibilités:', error);
  } finally {
    loading.value = false;
  }
};

// Écouter les changements de disponibilités depuis le composant
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
