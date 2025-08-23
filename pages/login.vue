<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            créez un compte
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Adresse email</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              v-model="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              v-model="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              v-model="rememberMe"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              Mot de passe oublié?
            </a>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>

      <!-- Comptes de démonstration -->
      <div class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">🚀 Comptes de démonstration</h3>
        <p class="text-blue-700 text-sm mb-4">Cliquez sur un compte pour vous connecter instantanément :</p>
        
        <div class="space-y-3">
          <!-- Compte Admin -->
          <button @click="quickLogin('admin@academ.com', 'admin123')" 
            class="w-full text-left p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-blue-200 hover:border-blue-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-blue-900">👑 Administrateur</p>
                <p class="text-sm text-blue-600">admin@academ.com</p>
              </div>
              <span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Admin</span>
            </div>
          </button>

          <!-- Compte Enseignant -->
          <button @click="quickLogin('robert@example.com', 'teacher123')" 
            class="w-full text-left p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-blue-200 hover:border-blue-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-blue-900">👨‍🏫 Enseignant</p>
                <p class="text-sm text-blue-600">robert@example.com</p>
              </div>
              <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Enseignant</span>
            </div>
          </button>

          <!-- Compte Étudiant -->
          <button @click="quickLogin('john@example.com', 'student123')" 
            class="w-full text-left p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-blue-200 hover:border-blue-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-blue-900">🎓 Étudiant</p>
                <p class="text-sm text-blue-600">john@example.com</p>
              </div>
              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Étudiant</span>
            </div>
          </button>
        </div>
        
        <p class="text-xs text-blue-600 mt-3">
          💡 Chaque rôle a son propre dashboard avec des fonctionnalités spécifiques
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login: authLogin, loading, error } = useAuth();

// État du formulaire
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

// Fonction de connexion
const login = async () => {
  const success = await authLogin(email.value, password.value);
  
  if (success) {
    // Rediriger vers la page demandée ou le dashboard selon le rôle
    const redirectPath = route.query.redirect || '/dashboard';
    router.push(redirectPath);
  }
};

// Connexion rapide avec les comptes de démonstration
const quickLogin = async (demoEmail, demoPassword) => {
  email.value = demoEmail;
  password.value = demoPassword;
  
  const success = await authLogin(email.value, password.value);
  
  if (success) {
    // Rediriger vers le dashboard
    const redirectPath = route.query.redirect || '/dashboard';
    router.push(redirectPath);
  }
};

// Configuration de la page
definePageMeta({
  title: 'Connexion - Academ Message',
  layout: 'default',
  auth: false // Cette page ne nécessite pas d'authentification
});
</script>