<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16">
          <img src="../assets/images/logo_academ.png" alt="logo-academ">
        </div>
      </div>

      <!-- Reset password form -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 text-center mb-2">Reset Password</h2>
          <p class="text-sm text-gray-500 text-center">
            Choose a new secure password
          </p>
        </div>

        <!-- Success message -->
        <div v-if="success" class="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100 mb-6">
          {{ success }}
          <div class="mt-3 text-center">
            <NuxtLink to="/login" class="text-purple-600 hover:text-purple-700 font-medium">
              → Sign in
            </NuxtLink>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100 mb-6">
          {{ error }}
        </div>

        <form v-if="!success" @submit.prevent="resetPassword" class="space-y-5">
          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <!-- Password Requirements -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Password requirements:</h4>
            <div class="space-y-2 text-xs">
              <div class="flex items-center space-x-2">
                <div :class="hasMinLength ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4 flex items-center justify-center">
                  <svg v-if="hasMinLength" fill="currentColor" viewBox="0 0 20 20" class="w-3 h-3">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3 h-3">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <span :class="hasMinLength ? 'text-green-600' : 'text-gray-500'">
                  At least 8 characters
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <div :class="hasUppercase ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4 flex items-center justify-center">
                  <svg v-if="hasUppercase" fill="currentColor" viewBox="0 0 20 20" class="w-3 h-3">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3 h-3">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <span :class="hasUppercase ? 'text-green-600' : 'text-gray-500'">
                  At least one uppercase letter
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <div :class="hasNumber ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4 flex items-center justify-center">
                  <svg v-if="hasNumber" fill="currentColor" viewBox="0 0 20 20" class="w-3 h-3">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3 h-3">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <span :class="hasNumber ? 'text-green-600' : 'text-gray-500'">
                  At least one number
                </span>
              </div>

              <div class="flex items-center space-x-2">
                <div :class="passwordsMatch ? 'text-green-500' : 'text-gray-400'" class="w-4 h-4 flex items-center justify-center">
                  <svg v-if="passwordsMatch" fill="currentColor" viewBox="0 0 20 20" class="w-3 h-3">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3 h-3">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <span :class="passwordsMatch ? 'text-green-600' : 'text-gray-500'">
                  Passwords match
                </span>
              </div>
            </div>
          </div>

          <!-- Reset button -->
          <button
            type="submit"
            :disabled="loading || !isPasswordValid"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
            <span v-else>Reset my password</span>
          </button>
        </form>

        <!-- Back to login -->
        <div v-if="!success" class="mt-6 text-center">
          <NuxtLink to="/login" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
            ← Back to login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const token = computed(() => route.query.token)

// Password validation
const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))
const passwordsMatch = computed(() => 
  password.value && confirmPassword.value && password.value === confirmPassword.value
)

const isPasswordValid = computed(() => 
  hasMinLength.value && hasUppercase.value && hasNumber.value && passwordsMatch.value
)

// Check if token is present on mount
onMounted(() => {
  if (!token.value) {
    error.value = 'Invalid or expired reset link'
  }
})

const resetPassword = async () => {
  if (!isPasswordValid.value) {
    error.value = 'Please meet all password requirements'
    return
  }

  loading.value = true
  error.value = null
  success.value = null
  
  try {
    const data = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        password: password.value 
      }
    })
    
    if (data.success) {
      success.value = data.message || 'Your password has been reset successfully.'
      
      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } catch (err) {
    console.error('Error resetting password:', err)
    error.value = err.data?.message || 'Error while resetting password'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  title: 'Reset Password - Academ',
  layout: 'auth',
  auth: false
})
</script>