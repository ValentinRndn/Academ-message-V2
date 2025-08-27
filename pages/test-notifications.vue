<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Test des Notifications</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Test des notifications toast -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Notifications Toast</h2>
          <div class="space-y-3">
            <button 
              @click="testSuccessToast"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Notification Succès
            </button>
            
            <button 
              @click="testErrorToast"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Test Notification Erreur
            </button>
            
            <button 
              @click="testInfoToast"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Notification Info
            </button>
            
            <button 
              @click="testWarningToast"
              class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Test Notification Avertissement
            </button>
          </div>
        </div>

        <!-- Test des notifications push -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Notifications Push</h2>
          <div class="space-y-3">
            <button 
              @click="testPushNotification"
              class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Test Notification Push
            </button>
            
            <div class="text-sm text-gray-600">
              <p><strong>Status:</strong> {{ pushStatus }}</p>
              <p><strong>Permission:</strong> {{ pushPermission }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul class="text-blue-800 space-y-1">
          <li>• Les notifications toast apparaissent en haut à droite</li>
          <li>• Elles doivent être larges et bien visibles</li>
          <li>• Cliquez sur "X" pour les fermer</li>
          <li>• Elles disparaissent automatiquement après 5 secondes</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
});

const { showSuccess, showError, showInfo, showWarning } = useToast()
const pushStatus = ref('Non testé')
const pushPermission = ref('Non vérifié')

// Test des notifications toast
const testSuccessToast = () => {
  showSuccess(
    'Connexion réussie !', 
    'Bienvenue Admin User, vous êtes maintenant connecté à votre compte.',
    8000
  )
}

const testErrorToast = () => {
  showError(
    'Erreur de connexion', 
    'Impossible de se connecter au serveur. Veuillez réessayer.',
    8000
  )
}

const testInfoToast = () => {
  showInfo(
    'Nouveau message', 
    'Vous avez reçu un nouveau message de Jean Dupont.',
    8000
  )
}

const testWarningToast = () => {
  showWarning(
    'Session expirée', 
    'Votre session va expirer dans 5 minutes. Veuillez sauvegarder votre travail.',
    8000
  )
}

// Test des notifications push
const testPushNotification = async () => {
  try {
    pushStatus.value = 'Test en cours...'
    
    const response = await $fetch('/api/notifications/test', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.success) {
      pushStatus.value = 'Notification envoyée avec succès !'
    } else {
      pushStatus.value = 'Erreur lors de l\'envoi'
    }
  } catch (error) {
    pushStatus.value = `Erreur: ${error.message}`
  }
}

// Vérifier les permissions push au montage
onMounted(() => {
  if ('Notification' in window) {
    pushPermission.value = Notification.permission
  } else {
    pushPermission.value = 'Non supporté'
  }
})
</script>
