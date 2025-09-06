<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
          <img src="../assets/images/logo_academ.png" alt="logo-academ" class="w-full h-full object-contain">
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Configuration de votre mot de passe</h1>
        <p class="text-gray-600">Créez votre mot de passe sécurisé pour accéder à votre compte</p>
      </div>

      <!-- Formulaire de configuration -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <!-- Étapes du processus -->
        <div class="mb-6">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div :class="step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div class="w-12 h-0.5 bg-gray-200"></div>
            <div :class="step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div class="w-12 h-0.5 bg-gray-200"></div>
            <div :class="step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
          </div>
          <div class="text-center">
            <p v-if="step === 1" class="text-sm text-gray-600">Vérification du mot de passe temporaire</p>
            <p v-else-if="step === 2" class="text-sm text-gray-600">Création de votre nouveau mot de passe</p>
            <p v-else class="text-sm text-green-600 font-medium">Compte activé avec succès !</p>
          </div>
        </div>

        <!-- Alerte d'erreur -->
        <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 mb-6">
          {{ error }}
        </div>

        <!-- Alerte de succès -->
        <div v-if="success" class="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100 mb-6">
          {{ success }}
        </div>

        <!-- Étape 1: Vérification du mot de passe temporaire -->
        <form v-if="step === 1" @submit.prevent="verifyTempPassword" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              :value="userEmail"
              type="email"
              disabled
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
            />
          </div>

          <div>
            <label for="tempPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe temporaire *
            </label>
            <div class="relative">
              <input
                id="tempPassword"
                v-model="tempPassword"
                :type="showTempPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-12"
                placeholder="Entrez le mot de passe reçu par email"
              />
              <button
                type="button"
                @click="showTempPassword = !showTempPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showTempPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              📧 Vérifiez votre boîte email pour récupérer ce mot de passe temporaire
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading || !tempPassword"
            class="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">Vérification...</span>
            <span v-else>Vérifier le mot de passe</span>
          </button>
        </form>

        <!-- Étape 2: Création du nouveau mot de passe -->
        <form v-else-if="step === 2" @submit.prevent="setupNewPassword" class="space-y-5">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe *
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-12"
                placeholder="Créez un mot de passe sécurisé"
                @input="checkPasswordStrength"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <!-- Indicateur de force du mot de passe -->
            <div v-if="newPassword" class="mt-2">
              <div class="flex space-x-1 mb-2">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  :class="getPasswordStrengthColor(i)"
                  class="flex-1 h-1.5 rounded-full"
                ></div>
              </div>
              <p :class="passwordStrength.color" class="text-xs font-medium">
                {{ passwordStrength.text }}
              </p>
            </div>
            
            <!-- Critères du mot de passe -->
            <div class="mt-3 space-y-1">
              <div class="flex items-center text-xs">
                <svg :class="passwordCriteria.length ? 'text-green-500' : 'text-gray-300'" class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="passwordCriteria.length ? 'text-green-600' : 'text-gray-500'">Au moins 8 caractères</span>
              </div>
              <div class="flex items-center text-xs">
                <svg :class="passwordCriteria.hasUpper ? 'text-green-500' : 'text-gray-300'" class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="passwordCriteria.hasUpper ? 'text-green-600' : 'text-gray-500'">Une majuscule</span>
              </div>
              <div class="flex items-center text-xs">
                <svg :class="passwordCriteria.hasNumber ? 'text-green-500' : 'text-gray-300'" class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="passwordCriteria.hasNumber ? 'text-green-600' : 'text-gray-500'">Un chiffre</span>
              </div>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-12"
                placeholder="Confirmez votre nouveau mot de passe"
                :class="confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="confirmPassword && newPassword !== confirmPassword" class="text-red-500 text-xs mt-1">
              Les mots de passe ne correspondent pas
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading || !isPasswordValid"
            class="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">Activation du compte...</span>
            <span v-else>Activer mon compte</span>
          </button>
        </form>

        <!-- Étape 3: Succès -->
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Compte activé avec succès !</h3>
          <p class="text-gray-600 mb-6">Votre mot de passe a été configuré et votre compte est maintenant actif.</p>
          
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            Se connecter
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Informations de contact -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">
          Besoin d'aide ? 
          <a href="mailto:support@academ-message.com" class="text-purple-600 hover:text-purple-700 font-medium">
            Contactez notre support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Métadonnées de la page
definePageMeta({
  layout: false, // Pas de layout par défaut
  title: 'Configuration du mot de passe'
});

// État du composant
const step = ref(1); // 1: vérification temp password, 2: nouveau password, 3: succès
const loading = ref(false);
const error = ref('');
const success = ref('');

// Formulaire étape 1
const tempPassword = ref('');
const showTempPassword = ref(false);

// Formulaire étape 2
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Récupération des paramètres d'URL
const route = useRoute();
const userEmail = ref(route.query.email || '');
const resetToken = ref(route.query.token || '');

// Vérification de la présence des paramètres
onMounted(() => {
  if (!userEmail.value || !resetToken.value) {
    error.value = 'Lien de configuration invalide. Veuillez utiliser le lien reçu par email.';
  }
});

// Validation de la force du mot de passe
const passwordCriteria = computed(() => ({
  length: newPassword.value.length >= 8,
  hasUpper: /[A-Z]/.test(newPassword.value),
  hasNumber: /\d/.test(newPassword.value)
}));

const passwordStrength = computed(() => {
  const score = Object.values(passwordCriteria.value).filter(Boolean).length;
  
  if (score === 0) return { text: '', color: '' };
  if (score === 1) return { text: 'Très faible', color: 'text-red-600' };
  if (score === 2) return { text: 'Faible', color: 'text-orange-500' };
  if (score === 3) return { text: 'Fort', color: 'text-green-600' };
});

const getPasswordStrengthColor = (index) => {
  const score = Object.values(passwordCriteria.value).filter(Boolean).length;
  
  if (index <= score) {
    if (score === 1) return 'bg-red-400';
    if (score === 2) return 'bg-orange-400';
    if (score === 3) return 'bg-green-500';
  }
  return 'bg-gray-200';
};

const isPasswordValid = computed(() => {
  return passwordCriteria.value.length &&
         passwordCriteria.value.hasUpper &&
         passwordCriteria.value.hasNumber &&
         newPassword.value === confirmPassword.value;
});

// Fonctions
const checkPasswordStrength = () => {
  // Trigger reactive updates
};

const verifyTempPassword = async () => {
  if (!tempPassword.value) {
    error.value = 'Veuillez entrer le mot de passe temporaire.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await $fetch('/api/auth/verify-temp-password', {
      method: 'POST',
      body: {
        email: userEmail.value,
        tempPassword: tempPassword.value,
        token: resetToken.value
      }
    });

    if (response.success) {
      step.value = 2;
      success.value = 'Mot de passe temporaire vérifié avec succès !';
      setTimeout(() => { success.value = ''; }, 3000);
    }
  } catch (err) {
    console.error('Erreur lors de la vérification:', err);
    error.value = err.data?.message || 'Mot de passe temporaire incorrect ou lien expiré.';
  } finally {
    loading.value = false;
  }
};

const setupNewPassword = async () => {
  if (!isPasswordValid.value) {
    error.value = 'Veuillez respecter tous les critères du mot de passe et confirmer la correspondance.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await $fetch('/api/auth/setup-password', {
      method: 'POST',
      body: {
        email: userEmail.value,
        tempPassword: tempPassword.value,
        newPassword: newPassword.value,
        token: resetToken.value
      }
    });

    if (response.success) {
      step.value = 3;
      // Redirection automatique après 5 secondes
      setTimeout(() => {
        navigateTo('/login');
      }, 5000);
    }
  } catch (err) {
    console.error('Erreur lors de la configuration:', err);
    error.value = err.data?.message || 'Erreur lors de la configuration du mot de passe.';
  } finally {
    loading.value = false;
  }
};
</script>