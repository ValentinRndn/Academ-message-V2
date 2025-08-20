<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Test d'authentification</h1>
      
      <!-- État d'authentification -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">État d'authentification</h2>
        <div class="space-y-2">
          <p><strong>Authentifié:</strong> {{ isAuthenticated ? 'Oui' : 'Non' }}</p>
          <p v-if="user"><strong>Utilisateur:</strong> {{ user.firstName }} {{ user.lastName }} ({{ user.email }})</p>
          <p v-if="user"><strong>Rôle:</strong> {{ user.role }}</p>
          <p v-if="loading">Chargement...</p>
          <p v-if="error" class="text-red-600">Erreur: {{ error }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Actions</h2>
        <div class="flex space-x-4">
          <button 
            @click="testApiCall"
            :disabled="!isAuthenticated || loadingApi"
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {{ loadingApi ? 'Chargement...' : 'Tester API protégée' }}
          </button>
          <button 
            @click="logout"
            :disabled="!isAuthenticated"
            class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <!-- Résultats de l'API -->
      <div v-if="apiResult" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Résultat de l'API protégée</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>

      <!-- Informations de test -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">Comptes de test</h3>
        <p class="text-yellow-700 mb-2">Vous pouvez vous connecter avec:</p>
        <ul class="text-yellow-700 space-y-1">
          <li><strong>Admin:</strong> admin@academ.com</li>
          <li><strong>Enseignant:</strong> robert@example.com, emily@example.com, david@example.com</li>
          <li><strong>Étudiant:</strong> john@example.com, jane@example.com, michael@example.com</li>
        </ul>
        <p class="text-yellow-700 mt-2"><strong>Mot de passe par défaut:</strong> Varie selon l'utilisateur (admin123, teacher123, student123)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utiliser le composable d'authentification
const { user, isAuthenticated, loading, error, logout } = useAuth();

// État pour l'appel API
const loadingApi = ref(false);
const apiResult = ref(null);

// Tester un appel API protégé
const testApiCall = async () => {
  loadingApi.value = true;
  apiResult.value = null;
  
  try {
    const { data } = await $fetch('/api/users');
    apiResult.value = data;
  } catch (err) {
    apiResult.value = { error: err.message || 'Erreur lors de l\'appel API' };
  } finally {
    loadingApi.value = false;
  }
};

// Configuration de la page
definePageMeta({
  title: 'Test d\'authentification'
});
</script>
