<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16">
          <img src="../assets/images/logo_academ.png" alt="logo-academ">
        </div>
      </div>

      <!-- Forgot password form -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 text-center mb-2">Forgot Password</h2>
          <p class="text-sm text-gray-500 text-center">
            Enter your email address to receive a reset link
          </p>
        </div>

        <!-- Success message -->
        <div v-if="success" class="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100 mb-6">
          {{ success }}
        </div>

        <!-- Error message -->
        <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100 mb-6">
          {{ error }}
        </div>

        <form v-if="!success" @submit.prevent="sendResetEmail" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="your@email.com"
            />
          </div>

          <!-- Send button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send reset link</span>
          </button>
        </form>

        <!-- Back to login -->
        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
            ← Back to login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const sendResetEmail = async () => {
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    const data = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    if (data.success) {
      success.value = data.message || 'A reset email has been sent to your address.'
    }
  } catch (err) {
    console.error('Error sending reset email:', err)
    error.value = err.data?.message || 'Error sending reset email'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  title: 'Forgot Password - Academ',
  layout: 'auth',
  auth: false
})
</script>