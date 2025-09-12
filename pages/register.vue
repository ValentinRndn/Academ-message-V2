<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16">
          <img src="../assets/images/logo_academ.png" alt="logo-academ">
        </div>
      </div>

      <!-- Registration form -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 text-center mb-2">Create an account</h2>
          <p class="text-sm text-gray-500 text-center">
            Already a member? 
            <NuxtLink to="/login" class="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </NuxtLink>
          </p>
        </div>

        <form @submit.prevent="register" class="space-y-5">
          <!-- Error alert -->
          <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

          <!-- Last name and First name -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First name
              </label>
              <input
                id="firstName"
                v-model="userData.firstName"
                type="text"
                required
                class="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="John"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last name
              </label>
              <input
                id="lastName"
                v-model="userData.lastName"
                type="text"
                required
                class="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Doe"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="userData.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="john.doe@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="userData.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              I am a
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative cursor-pointer">
                <input
                  v-model="userData.role"
                  type="radio"
                  value="student"
                  class="sr-only"
                />
                <div
                  :class="userData.role === 'student' ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' : 'border-gray-200 hover:border-gray-300'"
                  class="p-4 border rounded-xl transition-all duration-200 bg-white"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Student</p>
                      <p class="text-xs text-gray-500">Learn</p>
                    </div>
                  </div>
                </div>
              </label>

              <label class="relative cursor-pointer">
                <input
                  v-model="userData.role"
                  type="radio"
                  value="teacher"
                  class="sr-only"
                />
                <div
                  :class="userData.role === 'teacher' ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' : 'border-gray-200 hover:border-gray-300'"
                  class="p-4 border rounded-xl transition-all duration-200 bg-white"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M7.616 21q-1.084 0-1.85-.766T5 18.384V6q0-1.258.871-2.129T8 3h9.385q.666 0 1.14.475T19 4.615v11.756q0 .156-.114.283q-.115.127-.309.192q-.523.137-.858.56t-.334.979q0 .536.325.962t.848.576q.215.073.329.213q.113.14.113.3v.058q0 .21-.144.358T18.5 21zm1.27-5.23q.212 0 .355-.145t.144-.356V4.5q0-.213-.144-.356Q9.097 4 8.884 4t-.356.144t-.144.356v10.77q0 .212.145.356t.356.143M7.615 20h9.364q-.285-.33-.44-.736t-.155-.88q0-.457.152-.87t.443-.745H7.616q-.689 0-1.152.472Q6 17.71 6 18.384q0 .689.464 1.152T7.616 20"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Teacher</p>
                      <p class="text-xs text-gray-500">Teach</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Terms -->
          <div class="text-xs text-gray-500 leading-relaxed">
            By creating an account, you accept our
            <a href="https://imators.com/terms-of-use" target="_blank" rel="noopener noreferrer" aria-label="Terms of service" class="text-purple-600 hover:text-purple-700 underline">
              Terms of Service
            </a>
            and
            <a href="https://imators.com/privacy" target="_blank" rel="noopener noreferrer" aria-label="Privacy policy" class="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </a>
            </div>

          <!-- Registration button -->
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
              Registering...
            </span>
            <span v-else>Create my account</span>
          </button>
        </form>
      </div>

      <!-- Additional info -->
      <div class="mt-6 text-center">
        <div class="inline-flex items-center justify-center space-x-2 text-sm text-gray-500 bg-white/50 rounded-full px-4 py-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Free registration - No card required</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { register: authRegister, loading, error } = useAuth()

// Form state
const userData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student',
  bio: ''
})

// Registration function
const register = async () => {
  const result = await authRegister(userData)
  
  if (result === 'pending_approval') {
    // Rediriger vers la page d'attente pour les professeurs
    router.push('/pending-approval')
  } else if (result === true) {
    // Connexion normale pour les étudiants
    router.push('/messages')
  }
}

definePageMeta({
  title: 'Registration - Academ',
  layout: 'default',
  auth: false
})
</script>