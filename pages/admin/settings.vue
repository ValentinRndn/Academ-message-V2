<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
          <p class="text-gray-600 mt-2">Platform configuration</p>
        </div>
        <button
          @click="saveAllSettings"
          :disabled="saving"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
        >
          <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Sections des paramètres -->
      <div v-else class="space-y-8">
        <!-- Paramètres généraux -->
        <div class="bg-white shadow-sm rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">General Settings</h2>
            <p class="mt-1 text-sm text-gray-600">General platform configuration</p>
          </div>
          <div class="px-6 py-6 space-y-6">

            <!-- Email de contact -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                v-model="settings.general.contactEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="contact@academ.com"
              >
            </div>


            <!-- Mode maintenance -->
            <div class="flex items-center">
              <input
                v-model="settings.general.maintenanceMode"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700">
                Maintenance mode (prevents user access)
              </label>
            </div>
          </div>
        </div>


        <!-- Paramètres des cours -->
        <div class="bg-white shadow-sm rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Lesson Settings</h2>
            <p class="mt-1 text-sm text-gray-600">Booking and lesson configuration</p>
          </div>
          <div class="px-6 py-6 space-y-6">
            <!-- Durée minimum d'un cours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Minimum lesson duration (minutes)
              </label>
              <select
                v-model.number="settings.booking.minDuration"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option :value="15">15 minutes</option>
                <option :value="30">30 minutes</option>
                <option :value="60">1 hour</option>
              </select>
            </div>

            <!-- Durée maximum d'un cours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Maximum lesson duration (hours)
              </label>
              <select
                v-model.number="settings.booking.maxDuration"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option :value="120">2 hours</option>
                <option :value="180">3 hours</option>
                <option :value="240">4 hours</option>
                <option :value="300">5 hours</option>
              </select>
            </div>

            <!-- Préavis minimum pour réserver -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Minimum advance booking (hours)
              </label>
              <input
                v-model.number="settings.booking.minAdvanceBooking"
                type="number"
                min="1"
                max="72"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <p class="mt-1 text-sm text-gray-500">Minimum time before lesson start to allow booking</p>
            </div>

            <!-- Préavis minimum pour annuler -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Minimum cancellation notice (hours)
              </label>
              <input
                v-model.number="settings.booking.minCancelAdvance"
                type="number"
                min="1"
                max="72"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <p class="mt-1 text-sm text-gray-500">Minimum time before lesson start to allow cancellation</p>
            </div>

            <!-- Auto-confirmation -->
            <div class="flex items-center">
              <input
                v-model="settings.booking.autoConfirm"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700">
                Automatic booking confirmation
              </label>
            </div>
          </div>
        </div>

        <!-- Paramètres de notification -->
        <div class="bg-white shadow-sm rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Notification Settings</h2>
            <p class="mt-1 text-sm text-gray-600">Email and notification configuration</p>
          </div>
          <div class="px-6 py-6 space-y-6">
            <!-- Email des notifications -->
            <div class="flex items-center">
              <input
                v-model="settings.notifications.emailEnabled"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>

            <!-- Notifications push -->
            <div class="flex items-center">
              <input
                v-model="settings.notifications.pushEnabled"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label class="ml-2 block text-sm text-gray-700">
                Enable push notifications
              </label>
            </div>

            <!-- Email expéditeur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sender Email
              </label>
              <input
                v-model="settings.notifications.fromEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="noreply@academ.com"
              >
            </div>

            <!-- Nom expéditeur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                v-model="settings.notifications.fromName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Academ"
              >
            </div>
          </div>
        </div>

        <!-- Informations système -->
        <div class="bg-white shadow-sm rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">System Information</h2>
            <p class="mt-1 text-sm text-gray-600">Current platform status</p>
          </div>
          <div class="px-6 py-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-700">Application Version</h4>
                <p class="text-sm text-gray-600">{{ systemInfo.appVersion }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700">Database</h4>
                <div class="flex items-center">
                  <span :class="systemInfo.dbStatus === 'connected' ? 'text-green-600' : 'text-red-600'" class="text-sm">
                    {{ systemInfo.dbStatus === 'connected' ? '✅ Connected' : '❌ Disconnected' }}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700">Stripe</h4>
                <div class="flex items-center">
                  <span :class="systemInfo.stripeStatus === 'configured' ? 'text-green-600' : 'text-red-600'" class="text-sm">
                    {{ systemInfo.stripeStatus === 'configured' ? '✅ Configured' : '❌ Not configured' }}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700">Active Users</h4>
                <p class="text-sm text-gray-600">{{ systemInfo.activeUsers }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notifications -->
    <div
      v-if="toast.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-md',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <div class="flex items-center">
        <svg v-if="toast.type === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'

// Métadonnées
definePageMeta({
  title: 'Settings'
})

// État
const loading = ref(true)
const error = ref('')
const saving = ref(false)

// Paramètres
const settings = ref({
  general: {
    contactEmail: 'contact@academ.com',
    maintenanceMode: false
  },
  booking: {
    minDuration: 30,
    maxDuration: 180,
    minAdvanceBooking: 2,
    minCancelAdvance: 24,
    autoConfirm: false
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    fromEmail: 'noreply@academ.com',
    fromName: 'Academ'
  }
})

// Informations système
const systemInfo = ref({
  appVersion: '1.0.0',
  dbStatus: 'connected',
  stripeStatus: 'configured',
  activeUsers: 0
})

// Toast
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Méthodes
const loadSettings = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const data = await $fetch('/api/admin/settings', {
      credentials: 'include'
    })
    
    if (data.settings) {
      settings.value = { ...settings.value, ...data.settings }
    }
    
    if (data.systemInfo) {
      systemInfo.value = { ...systemInfo.value, ...data.systemInfo }
    }
  } catch (err) {
    error.value = err.data?.message || 'Erreur lors du chargement des paramètres'
  } finally {
    loading.value = false
  }
}

const saveAllSettings = async () => {
  try {
    saving.value = true
    
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { settings: settings.value },
      credentials: 'include'
    })
    
    showToast('success', 'Paramètres sauvegardés avec succès')
  } catch (err) {
    showToast('error', err.data?.message || 'Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>