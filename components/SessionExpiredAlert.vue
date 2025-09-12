<template>
  <div 
    v-if="showSessionAlert" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeSessionAlert"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">
            Session expirée
          </h3>
        </div>
      </div>
      
      <div class="mb-6">
        <p class="text-sm text-gray-500">
          Votre session a expiré après 7 jours d'inactivité. Pour des raisons de sécurité, vous devez vous reconnecter.
        </p>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="closeSessionAlert"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Se reconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utiliser le composable d'authentification
const { showSessionAlert, closeSessionAlert } = useAuth();
</script>

<style scoped>
/* Assurer que l'alerte soit au-dessus de tout */
.z-50 {
  z-index: 50;
}
</style>
