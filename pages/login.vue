<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16">
          <img src="../assets/images/logo_academ.png" alt="logo-academ">
        </div>
      </div>

      <!-- Formulaire de connexion -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 text-center mb-2">Connexion</h2>
          <p class="text-sm text-gray-500 text-center">
            Nouveau ? 
            <NuxtLink to="/register" class="text-purple-600 hover:text-purple-700 font-medium">
              Créez un compte
            </NuxtLink>
          </p>
        </div>

        <form @submit.prevent="login" class="space-y-6">
          <!-- Alerte d'erreur -->
          <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {{ error }}
          </div>

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
              placeholder="votre@email.com"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
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

          <!-- Options -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              />
              <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <a href="#" class="text-sm text-purple-600 hover:text-purple-700">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Bouton de connexion -->
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
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login: authLogin, loading, error } = useAuth()

// État du formulaire
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Fonction de connexion
const login = async () => {
  const success = await authLogin(email.value, password.value)
  
  if (success) {
    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  }
}


definePageMeta({
  title: 'Connexion - Academ',
  layout: 'default',
  auth: false
})
</script>