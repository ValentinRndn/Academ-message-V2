import { ref, computed, readonly } from 'vue';

export const useAvailability = () => {
  const availability = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Récupérer les disponibilités du professeur connecté
  const fetchAvailability = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await $fetch('/api/teachers/availability', {
        credentials: 'include'
      });
      
      availability.value = response.availability || [];
      return response.availability;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des disponibilités';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Mettre à jour les disponibilités
  const updateAvailability = async (newAvailability: any[]) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await $fetch('/api/teachers/availability', {
        method: 'PUT',
        body: { availability: newAvailability },
        credentials: 'include'
      });
      
      availability.value = response.availability;
      
      // Émettre un événement pour notifier les autres composants
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('availability-updated'));
      }
      
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour des disponibilités';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Récupérer les créneaux disponibles pour un professeur
  const fetchAvailableSlots = async (teacherId: string, date: string, duration: number = 60) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await $fetch(`/api/teachers/${teacherId}/available-slots`, {
        query: { date, duration },
        credentials: 'include'
      });
      
      return response.availableSlots || [];
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des créneaux';
      throw err;
    } finally {
      loading.value = false;
    }
  };

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
    availability.value.forEach((slot: any) => {
      const day = days.find(d => d.dayOfWeek === slot.dayOfWeek);
      if (day) {
        day.slots.push(slot);
      }
    });
    
    // Trier les créneaux par heure de début
    days.forEach(day => {
      day.slots.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
    });
    
    return days;
  });

  // Vérifier si un jour a des disponibilités
  const hasAvailabilityForDay = (dayOfWeek: number) => {
    return availability.value.some((slot: any) => slot.dayOfWeek === dayOfWeek);
  };

  // Obtenir les créneaux pour un jour spécifique
  const getSlotsForDay = (dayOfWeek: number) => {
    return availability.value.filter((slot: any) => slot.dayOfWeek === dayOfWeek);
  };

  // Formater une heure
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    // État
    availability: readonly(availability),
    loading: readonly(loading),
    error: readonly(error),
    
    // Méthodes
    fetchAvailability,
    updateAvailability,
    fetchAvailableSlots,
    
    // Computed
    availabilityByDay,
    
    // Utilitaires
    hasAvailabilityForDay,
    getSlotsForDay,
    formatTime
  };
};
