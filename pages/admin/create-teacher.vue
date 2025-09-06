<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Créer un utilisateur</h1>
          <p class="text-gray-600 mt-2">Inscrire un nouveau utilisateur sur la plateforme</p>
        </div>
        <NuxtLink 
          to="/admin/users" 
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </NuxtLink>
      </div>
    </div>

    <!-- Formulaire -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-purple-600 to-purple-600 px-8 py-6">
        <h2 class="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Informations de l'utilisateur
        </h2>
      </div>

      <form @submit.prevent="createTeacher" class="p-8">
        <!-- Informations personnelles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Prénom de l'utilisateur"
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Nom de l'utilisateur"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="email@exemple.com"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        <!-- Sélection du rôle -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Type d'utilisateur *
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            <label class="relative cursor-pointer">
              <input
                v-model="form.role"
                type="radio"
                value="student"
                class="sr-only"
              />
              <div
                :class="form.role === 'student' ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' : 'border-gray-200 hover:border-gray-300'"
                class="p-4 border rounded-xl transition-all duration-200 bg-white"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Étudiant</div>
                    <div class="text-sm text-gray-500">Peut réserver des cours</div>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="relative cursor-pointer">
              <input
                v-model="form.role"
                type="radio"
                value="teacher"
                class="sr-only"
              />
              <div
                :class="form.role === 'teacher' ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' : 'border-gray-200 hover:border-gray-300'"
                class="p-4 border rounded-xl transition-all duration-200 bg-white"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Professeur</div>
                    <div class="text-sm text-gray-500">Peut donner des cours</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Informations professionnelles (uniquement pour les professeurs) -->
        <div v-if="form.role === 'teacher'" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            Informations professionnelles
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="specialization" class="block text-sm font-medium text-gray-700 mb-2">
                Spécialisation *
              </label>
              <input
                id="specialization"
                v-model="form.specialization"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Ex: Mathématiques, Physique, Anglais..."
              />
            </div>

            <div>
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                Années d'expérience
              </label>
              <input
                id="experience"
                v-model="form.experience"
                type="number"
                min="0"
                max="50"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="5"
              />
            </div>
          </div>

          <div class="mt-6">
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
              Biographie
            </label>
            <textarea
              id="bio"
              v-model="form.bio"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Présentation du professeur, son parcours, ses méthodes d'enseignement..."
            ></textarea>
          </div>
        </div>

        <!-- Matières enseignées (uniquement pour les professeurs) -->
        <div v-if="form.role === 'teacher'" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Matières enseignées
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="subjectsLoading" class="col-span-3 text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p class="text-gray-500 mt-2">Chargement des matières...</p>
            </div>
            <div v-else-if="availableSubjects?.subjects?.length" v-for="subject in availableSubjects.subjects" :key="subject._id" class="flex items-center">
              <input
                :id="'subject-' + subject._id"
                v-model="form.subjects"
                :value="subject._id"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label :for="'subject-' + subject._id" class="ml-2 text-sm text-gray-700">
                {{ subject.name }}
              </label>
            </div>
          </div>

          <div v-if="!subjectsLoading && (!availableSubjects?.subjects || availableSubjects.subjects.length === 0)" class="text-center py-4 text-gray-500">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>Aucune matière disponible</p>
            <NuxtLink to="/admin/subjects" class="text-purple-600 hover:text-purple-700 text-sm">
              Créer des matières d'abord
            </NuxtLink>
          </div>
        </div>

        <!-- Mot de passe généré -->
        <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Mot de passe généré
          </h3>

          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe temporaire
              </label>
              <div class="flex items-center space-x-2">
                <input
                  :value="generatedPassword"
                  type="text"
                  readonly
                  class="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-lg"
                />
                <button
                  type="button"
                  @click="generateNewPassword"
                  class="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="copyPassword"
                  class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start">
              <svg class="h-5 w-5 text-yellow-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="text-sm text-yellow-800">
                <p class="font-medium">Important :</p>
                <p>Ce mot de passe sera envoyé par email à l'utilisateur. Il devra le changer lors de sa première connexion.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/admin/users')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">Création en cours...</span>
            <span v-else>Créer l'utilisateur</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification et vérification du rôle admin
definePageMeta({
  title: 'Créer un utilisateur'
});

// Vérifier que l'utilisateur est admin
const { user } = useAuth();
if (user.value?.role !== 'admin') {
  throw createError({
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'Accès réservé aux administrateurs'
  });
}

// État du formulaire
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'student', // Par défaut étudiant
  specialization: '',
  experience: '',
  bio: '',
  subjects: []
});

// État de l'interface
const loading = ref(false);
const generatedPassword = ref('');

// Récupérer les matières disponibles
const { data: availableSubjects, error: subjectsError, pending: subjectsLoading } = await useFetch('/api/subjects');

// Afficher les erreurs de chargement des matières
if (subjectsError.value) {
  console.error('Erreur lors du chargement des matières:', subjectsError.value);
}

// Générer un mot de passe sécurisé
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Générer un nouveau mot de passe
const generateNewPassword = () => {
  generatedPassword.value = generatePassword();
};

// Générer un mot de passe au chargement de la page
onMounted(() => {
  generateNewPassword();
});

// Copier le mot de passe dans le presse-papiers
const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(generatedPassword.value);
    const { showSuccess } = useToast();
    showSuccess('Mot de passe copié !', 'Le mot de passe a été copié dans le presse-papiers.');
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
    const { showError } = useToast();
    showError('Erreur', 'Impossible de copier le mot de passe.');
  }
};

// Validation du formulaire
const isFormValid = computed(() => {
  const baseValid = form.value.firstName && 
                   form.value.lastName && 
                   form.value.email && 
                   generatedPassword.value;
  
  // Si c'est un professeur, vérifier la spécialisation
  if (form.value.role === 'teacher') {
    return baseValid && form.value.specialization;
  }
  
  return baseValid;
});

// Créer l'utilisateur
const createTeacher = async () => {
  if (!isFormValid.value) {
    const { showError } = useToast();
    showError('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires.');
    return;
  }

  loading.value = true;

  try {
    const response = await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        ...form.value,
        password: generatedPassword.value
      }
    });

    if (response.success) {
      const { showSuccess } = useToast();
      const roleText = form.value.role === 'teacher' ? 'professeur' : 'étudiant';
      const emailStatus = response.emailSent 
        ? 'Un email avec le lien de configuration a été envoyé.'
        : 'Aucun email envoyé (configuration SMTP manquante).';
      
      showSuccess(
        `${roleText.charAt(0).toUpperCase() + roleText.slice(1)} créé !`, 
        `${roleText.charAt(0).toUpperCase() + roleText.slice(1)} ${form.value.firstName} ${form.value.lastName} a été créé avec succès. ${emailStatus}`
      );
      
      // Rediriger vers la liste des utilisateurs
      await navigateTo('/admin/users');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    const { showError } = useToast();
    showError(
      'Erreur', 
      error.data?.message || 'Une erreur est survenue lors de la création de l\'utilisateur.'
    );
  } finally {
    loading.value = false;
  }
};

// Générer un mot de passe initial au montage
onMounted(() => {
  generateNewPassword();
});
</script>
