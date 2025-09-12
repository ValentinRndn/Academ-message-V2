<template>
  <div v-if="showAlert" class="fixed bottom-4 right-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md shadow-lg rounded-lg">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-yellow-700">
          Votre session expire {{ expirationText }}
        </p>
        <div class="mt-4 flex space-x-3">
          <button
            @click="handleRenewSession"
            class="text-sm font-medium text-yellow-700 hover:text-yellow-600 bg-yellow-100 px-3 py-2 rounded-md transition-colors"
            :disabled="loading"
          >
            {{ loading ? 'Renouvellement...' : 'Renouveler la session' }}
          </button>
          <button
            @click="handleDismiss"
            class="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            Ignorer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const { login, user } = useAuth();
const loading = ref(false);
const showAlert = ref(false);
const expiresAt = ref(null);

// Formater le temps restant
const expirationText = computed(() => {
  if (!expiresAt.value) return '';
  
  const now = Date.now();
  const timeLeft = expiresAt.value - now;
  
  if (timeLeft <= 0) return 'bientôt';
  
  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `dans ${days} jour${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `dans ${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    return 'très bientôt';
  }
});

// Fonction pour renouveler la session
const handleRenewSession = async () => {
  loading.value = true;
  try {
    // Réutiliser les informations de l'utilisateur pour se reconnecter
    await login(user.value.email, user.value.password);
    showAlert.value = false;
  } catch (error) {
    console.error('Erreur lors du renouvellement de la session:', error);
  } finally {
    loading.value = false;
  }
};

// Fonction pour ignorer l'alerte
const handleDismiss = () => {
  showAlert.value = false;
};

// Exposer les méthodes pour le composant parent
defineExpose({
  showAlert: (expiration) => {
    expiresAt.value = expiration;
    showAlert.value = true;
  },
  hideAlert: () => {
    showAlert.value = false;
  }
});
</script>
