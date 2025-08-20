<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Test de gestion de session</h1>
      
      <!-- État d'authentification -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">État de la session</h2>
        <div class="space-y-2">
          <p><strong>Authentifié:</strong> {{ isAuthenticated ? 'Oui' : 'Non' }}</p>
          <p v-if="user"><strong>Utilisateur:</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p v-if="isSessionExpiring" class="text-orange-600">
            <strong>⚠️ Session expire bientôt:</strong> {{ formatTimeLeft(sessionTimeLeft) }}
          </p>
          <p v-if="showSessionAlert" class="text-red-600">
            <strong>🚨 Alerte de session affichée</strong>
          </p>
        </div>
      </div>

      <!-- Actions de test -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Actions de test</h2>
        <div class="space-y-4">
          <button 
            @click="checkSession"
            :disabled="!isAuthenticated || loadingCheck"
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mr-4"
          >
            {{ loadingCheck ? 'Vérification...' : 'Vérifier la session' }}
          </button>
          
          <button 
            @click="simulateExpiredSession"
            :disabled="!isAuthenticated"
            class="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50 mr-4"
          >
            Simuler session expirée
          </button>
          
          <button 
            @click="simulateExpiringSession"
            :disabled="!isAuthenticated"
            class="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
          >
            Simuler session qui expire
          </button>
        </div>
      </div>

      <!-- Informations système -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Configuration</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Durée de session:</strong> 7 jours</p>
          <p><strong>Vérification automatique:</strong> Toutes les 5 minutes</p>
          <p><strong>Alerte d'expiration:</strong> Quand il reste moins de 24h</p>
          <p><strong>Action à l'expiration:</strong> Déconnexion automatique + alerte</p>
        </div>
      </div>
      
      <!-- Résultats de test -->
      <div v-if="testResult" class="bg-gray-100 rounded-lg p-6 mt-6">
        <h3 class="text-lg font-semibold mb-2">Résultat du test</h3>
        <pre class="text-sm">{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utiliser le composable d'authentification
const { 
  user, 
  isAuthenticated, 
  isSessionExpiring,
  sessionTimeLeft,
  showSessionAlert,
  checkSessionStatus,
  logout
} = useAuth();

// État local
const loadingCheck = ref(false);
const testResult = ref(null);

// Vérifier manuellement la session
const checkSession = async () => {
  loadingCheck.value = true;
  testResult.value = null;
  
  try {
    await checkSessionStatus();
    testResult.value = {
      message: 'Vérification de session effectuée',
      isExpiring: isSessionExpiring.value,
      timeLeft: sessionTimeLeft.value,
      showAlert: showSessionAlert.value
    };
  } catch (error) {
    testResult.value = { error: error.message };
  } finally {
    loadingCheck.value = false;
  }
};

// Simuler une session expirée
const simulateExpiredSession = () => {
  // Supprimer le token pour simuler l'expiration
  localStorage.removeItem('auth_token');
  logout();
  testResult.value = {
    message: 'Session expirée simulée - vous devriez être déconnecté'
  };
};

// Simuler une session qui expire bientôt
const simulateExpiringSession = () => {
  // Simuler l'état d'expiration
  isSessionExpiring.value = true;
  sessionTimeLeft.value = 12 * 60 * 60 * 1000; // 12 heures
  testResult.value = {
    message: 'Session expirante simulée - vous devriez voir un avertissement'
  };
};

// Formater le temps restant
const formatTimeLeft = (timeInMs) => {
  if (!timeInMs) return 'Inconnu';
  
  const hours = Math.floor(timeInMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

// Configuration de la page
definePageMeta({
  title: 'Test de session'
});
</script>
