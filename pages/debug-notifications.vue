<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Debug des Notifications PWA</h1>
      
      <!-- Configuration VAPID -->
      <div class="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-blue-900 mb-4">Configuration VAPID</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Clé publique côté client:</strong></p>
          <code class="block p-2 bg-blue-100 rounded text-xs break-all">
            {{ vapidPublicKey || 'Non configurée' }}
          </code>
        </div>
      </div>

      <!-- Support du navigateur -->
      <div class="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Support du Navigateur</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Service Worker:</strong>
            <span :class="serviceWorkerSupported ? 'text-green-600' : 'text-red-600'">
              {{ serviceWorkerSupported ? '✓ Supporté' : '✗ Non supporté' }}
            </span>
          </div>
          <div>
            <strong>Push Manager:</strong>
            <span :class="pushManagerSupported ? 'text-green-600' : 'text-red-600'">
              {{ pushManagerSupported ? '✓ Supporté' : '✗ Non supporté' }}
            </span>
          </div>
          <div>
            <strong>Notifications:</strong>
            <span :class="notificationSupported ? 'text-green-600' : 'text-red-600'">
              {{ notificationSupported ? '✓ Supporté' : '✗ Non supporté' }}
            </span>
          </div>
          <div>
            <strong>Permission:</strong>
            <span :class="permissionClass">
              {{ notificationPermission }}
            </span>
          </div>
        </div>
      </div>

      <!-- Service Worker Status -->
      <div class="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-purple-900 mb-4">Service Worker</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Status:</strong> <span :class="swStatusClass">{{ swStatus }}</span></p>
          <p><strong>Scope:</strong> {{ swScope || 'Non disponible' }}</p>
          <div v-if="swError" class="bg-red-100 border border-red-300 rounded p-2 mt-2">
            <strong>Erreur:</strong> {{ swError }}
          </div>
        </div>
      </div>

      <!-- Abonnement Push -->
      <div class="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-yellow-900 mb-4">Abonnement Push</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Status:</strong> 
            <span :class="subscriptionStatus === 'Abonné' ? 'text-green-600' : 'text-orange-600'">
              {{ subscriptionStatus }}
            </span>
          </p>
          <div v-if="subscriptionEndpoint" class="bg-yellow-100 rounded p-2">
            <p><strong>Endpoint:</strong></p>
            <code class="text-xs break-all">{{ subscriptionEndpoint }}</code>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-green-900 mb-4">Actions de Test</h2>
        <div class="space-y-3">
          <button 
            @click="requestPermission"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {{ loading ? 'En cours...' : 'Demander la Permission' }}
          </button>

          <button 
            @click="testLocalNotification"
            :disabled="notificationPermission !== 'granted'"
            class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            Test Notification Locale
          </button>

          <button 
            @click="testPushNotification"
            :disabled="!isSubscribed || loading"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {{ loading ? 'Envoi...' : 'Test Push Notification' }}
          </button>
        </div>
      </div>

      <!-- Logs -->
      <div v-if="logs.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Logs de Debug</h2>
        <div class="space-y-1 text-sm font-mono">
          <div v-for="(log, index) in logs" :key="index" :class="getLogClass(log.type)">
            [{{ log.time }}] {{ log.message }}
          </div>
        </div>
        <button @click="clearLogs" class="mt-4 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
          Effacer les logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $fetch } = useNuxtApp()

// Configuration
const vapidPublicKey = useRuntimeConfig().public.vapidPublicKey

// État réactif
const serviceWorkerSupported = ref(false)
const pushManagerSupported = ref(false)
const notificationSupported = ref(false)
const notificationPermission = ref('default')
const swStatus = ref('Non initialisé')
const swScope = ref('')
const swError = ref('')
const subscriptionStatus = ref('Non vérifié')
const subscriptionEndpoint = ref('')
const isSubscribed = ref(false)
const loading = ref(false)
const logs = ref([])

// Classes CSS conditionnelles
const permissionClass = computed(() => {
  switch (notificationPermission.value) {
    case 'granted': return 'text-green-600'
    case 'denied': return 'text-red-600'
    default: return 'text-orange-600'
  }
})

const swStatusClass = computed(() => {
  switch (swStatus.value) {
    case 'Enregistré': return 'text-green-600'
    case 'Erreur': return 'text-red-600'
    default: return 'text-orange-600'
  }
})

// Fonction pour ajouter des logs
const addLog = (type, message) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ type, message, time })
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const getLogClass = (type) => {
  switch (type) {
    case 'success': return 'text-green-600'
    case 'error': return 'text-red-600'
    case 'warning': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

const clearLogs = () => {
  logs.value = []
}

// Vérifier le support du navigateur
const checkSupport = () => {
  serviceWorkerSupported.value = 'serviceWorker' in navigator
  pushManagerSupported.value = 'PushManager' in window
  notificationSupported.value = 'Notification' in window
  
  if (notificationSupported.value) {
    notificationPermission.value = Notification.permission
  }
  
  addLog('info', `Service Worker: ${serviceWorkerSupported.value ? 'OK' : 'Non supporté'}`)
  addLog('info', `Push Manager: ${pushManagerSupported.value ? 'OK' : 'Non supporté'}`)
  addLog('info', `Notifications: ${notificationSupported.value ? 'OK' : 'Non supporté'}`)
  addLog('info', `Permission: ${notificationPermission.value}`)
}

// Vérifier le service worker
const checkServiceWorker = async () => {
  if (!serviceWorkerSupported.value) return
  
  try {
    const registration = await navigator.serviceWorker.ready
    swStatus.value = 'Enregistré'
    swScope.value = registration.scope
    addLog('success', `Service Worker enregistré avec le scope: ${registration.scope}`)
    
    // Vérifier l'abonnement push
    await checkPushSubscription(registration)
  } catch (error) {
    swStatus.value = 'Erreur'
    swError.value = error.message
    addLog('error', `Erreur Service Worker: ${error.message}`)
  }
}

// Vérifier l'abonnement push
const checkPushSubscription = async (registration) => {
  try {
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      subscriptionStatus.value = 'Abonné'
      subscriptionEndpoint.value = subscription.endpoint
      isSubscribed.value = true
      addLog('success', 'Abonnement push actif')
    } else {
      subscriptionStatus.value = 'Non abonné'
      isSubscribed.value = false
      addLog('warning', 'Pas d\'abonnement push')
    }
  } catch (error) {
    subscriptionStatus.value = 'Erreur'
    addLog('error', `Erreur vérification abonnement: ${error.message}`)
  }
}

// Demander la permission
const requestPermission = async () => {
  if (!notificationSupported.value) {
    addLog('error', 'Notifications non supportées par ce navigateur')
    return
  }
  
  loading.value = true
  addLog('info', 'Demande de permission en cours...')
  
  try {
    const permission = await Notification.requestPermission()
    notificationPermission.value = permission
    
    if (permission === 'granted') {
      addLog('success', 'Permission accordée')
      await checkServiceWorker() // Recheck pour l'abonnement
    } else {
      addLog('warning', `Permission: ${permission}`)
    }
  } catch (error) {
    addLog('error', `Erreur permission: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Test notification locale
const testLocalNotification = () => {
  if (notificationPermission.value !== 'granted') {
    addLog('error', 'Permission requise pour les notifications')
    return
  }
  
  const notification = new Notification('Test Notification', {
    body: 'Ceci est un test de notification locale !',
    icon: '/icon512_rounded.png',
    badge: '/icon512_rounded.png'
  })
  
  addLog('success', 'Notification locale envoyée')
  
  notification.onclick = () => {
    addLog('info', 'Notification cliquée')
    notification.close()
  }
}

// Test push notification
const testPushNotification = async () => {
  if (!isSubscribed.value) {
    addLog('error', 'Pas d\'abonnement push actif')
    return
  }
  
  loading.value = true
  addLog('info', 'Envoi d\'une push notification...')
  
  try {
    const response = await $fetch('/api/notifications/test', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.success) {
      addLog('success', 'Push notification envoyée avec succès')
    } else {
      addLog('error', 'Échec envoi push notification')
    }
  } catch (error) {
    addLog('error', `Erreur push notification: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Initialisation
onMounted(async () => {
  addLog('info', 'Initialisation du debug des notifications...')
  checkSupport()
  
  if (serviceWorkerSupported.value) {
    await checkServiceWorker()
  }
})
</script>

<style scoped>
code {
  font-family: 'Courier New', Courier, monospace;
}
</style>