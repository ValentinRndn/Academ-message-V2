<template>
  <div class="notification-toggle">
    <div v-if="!isSupported" class="text-sm text-gray-500">
      Notifications are not supported by your browser
    </div>
    
    <div v-else-if="permission === 'default'" class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">Push Notifications</h3>
          <p class="text-sm text-gray-500">
            Receive notifications for your courses, messages, and reminders
          </p>
        </div>
                 <button
           @click="requestPermissionHandler"
           :disabled="loading"
          class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Activating...' : 'Activate' }}
        </button>
      </div>
    </div>
    
    <div v-else-if="permission === 'granted'" class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">Push Notifications</h3>
          <p class="text-sm text-gray-500">
            <span class="text-green-600">✓ Enabled</span> - You will receive notifications
          </p>
        </div>
        <button
          @click="unsubscribe"
          :disabled="loading"
          class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Disabling...' : 'Disable' }}
        </button>
      </div>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Notifications enabled
            </h3>
                              <div class="mt-2 text-sm text-green-700">
                    <p>You will receive notifications for:</p>
                    <ul class="mt-1 list-disc list-inside space-y-1">
                      <li>New course bookings</li>
                      <li>Confirmations and cancellations</li>
                      <li>New messages</li>
                      <li>Course reminders (1h before)</li>
                      <li>New reviews</li>
                      <li>Payment confirmations</li>
                    </ul>
                    
                    <!-- Test button -->
                    <div class="mt-4">
                      <button
                        @click="testNotification"
                        :disabled="testing"
                        class="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg v-if="testing" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ testing ? 'Sending...' : 'Test' }}
                      </button>
                    </div>
                  </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="permission === 'denied'" class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-900">Push Notifications</h3>
          <p class="text-sm text-red-600">
            Permission denied - Enable notifications in your browser settings
          </p>
        </div>
      </div>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Notifications disabled
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>To enable notifications:</p>
              <ol class="mt-1 list-decimal list-inside space-y-1">
                <li>Click on the lock icon in the address bar</li>
                <li>Allow notifications for this site</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Error
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const {
  isSupported,
  permission,
  loading,
  error,
  checkSupport,
  requestPermission,
  unsubscribeFromPush
} = useNotifications()

const testing = ref(false)

// Initialize notifications on component mount
onMounted(() => {
  checkSupport()
})

// Request permission
const requestPermissionHandler = async () => {
  const success = await requestPermission()
  if (success) {
    // Optional: show success message
    console.log('Notifications activated successfully!')
  }
}

// Unsubscribe
const unsubscribe = async () => {
  const success = await unsubscribeFromPush()
  if (success) {
    // Optional: show success message
    console.log('Notifications disabled successfully!')
  }
}

// Test notifications
const testNotification = async () => {
  try {
    testing.value = true
    
    const response = await $fetch('/api/notifications/test', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.success) {
      console.log('Test notification sent successfully!')
    }
  } catch (err) {
    console.error('Error testing notification:', err)
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.notification-toggle {
  @apply w-full;
}
</style>
