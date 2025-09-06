<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mes Étudiants</h1>
        <p class="mt-2 text-gray-600">
          Gérez vos étudiants et suivez leurs progrès.
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total étudiants</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Actifs ce mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Heures enseignées</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalHours }}h</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Note moyenne</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.averageRating }}/5</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un étudiant..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="new">Nouveaux</option>
          </select>
          
          <select v-model="subjectFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="all">Toutes les matières</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
          
          <button 
            @click="exportStudents"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Exporter
          </button>
        </div>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Liste des étudiants</h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Chargement des étudiants...</p>
        </div>

        <div v-else-if="filteredStudents.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p class="mt-2 text-gray-500">Aucun étudiant trouvé</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="student in filteredStudents" 
            :key="student._id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewStudentDetails(student)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-lg">
                    {{ student.firstName.charAt(0) }}{{ student.lastName.charAt(0) }}
                  </span>
                </div>

                <!-- Informations de base -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ student.firstName }} {{ student.lastName }}
                    </h3>
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getStatusClass(student.status)
                      ]"
                    >
                      {{ getStatusText(student.status) }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{{ student.email }}</span>
                    <span>•</span>
                    <span>{{ student.subjects.join(', ') }}</span>
                    <span>•</span>
                    <span>{{ student.totalCourses }} cours</span>
                  </div>
                </div>
              </div>

              <!-- Statistiques rapides -->
              <div class="flex items-center space-x-6 text-sm">
                <div class="text-center">
                  <p class="font-medium text-gray-900">{{ student.totalHours }}h</p>
                  <p class="text-gray-500">Total</p>
                </div>
                <div class="text-center">
                  <p class="font-medium text-gray-900">{{ student.averageRating }}/5</p>
                  <p class="text-gray-500">Note</p>
                </div>
                <div class="text-center">
                  <p class="font-medium text-gray-900">{{ student.lastCourseDate ? formatDate(student.lastCourseDate) : 'Jamais' }}</p>
                  <p class="text-gray-500">Dernier cours</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button 
                  @click.stop="sendMessage(student)"
                  class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Envoyer un message"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                
                <button 
                  @click.stop="scheduleCourse(student)"
                  class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Programmer un cours"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                
                <button 
                  @click.stop="viewStudentDetails(student)"
                  class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Progrès récent -->
            <div v-if="student.recentProgress" class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm font-medium text-gray-700">Progrès récent :</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${student.recentProgress}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-500">{{ student.recentProgress }}%</span>
                  </div>
                </div>
                <span class="text-sm text-gray-500">{{ student.lastActivity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupérer l'utilisateur
const { user } = useAuth();

// État réactif
const loading = ref(false);
const students = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');
const subjectFilter = ref('all');

// Statistiques
const stats = ref({
  totalStudents: 0,
  activeStudents: 0,
  totalHours: 0,
  averageRating: 0
});

// Matières disponibles
const subjects = ref(['Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais', 'Histoire']);

// Computed properties - Les filtres sont maintenant gérés côté serveur
const filteredStudents = computed(() => {
  return students.value;
});

// Méthodes
const loadStudents = async () => {
  try {
    loading.value = true;
    
    // Construire les paramètres de requête
    const params = new URLSearchParams();
    if (statusFilter.value !== 'all') params.append('status', statusFilter.value);
    if (subjectFilter.value !== 'all') params.append('subject', subjectFilter.value);
    if (searchQuery.value) params.append('search', searchQuery.value);
    
    const response = await $fetch(`/api/teachers/students?${params.toString()}`, {
      credentials: 'include'
    });
    
    students.value = response.students || [];
    stats.value = response.stats || {
      totalStudents: 0,
      activeStudents: 0,
      totalHours: 0,
      averageRating: 0
    };

  } catch (error) {
    console.error('Erreur lors du chargement des étudiants:', error);
    // En cas d'erreur, utiliser des données de fallback
    students.value = [];
    stats.value = {
      totalStudents: 0,
      activeStudents: 0,
      totalHours: 0,
      averageRating: 0
    };
  } finally {
    loading.value = false;
  }
};

// Supprimer cette fonction car les stats viennent maintenant de l'API

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'inactive': return 'Inactif';
    default: return status;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

const viewStudentDetails = (student) => {
  // TODO: Naviguer vers la page de détails de l'étudiant
  console.log('Voir les détails de:', student);
  navigateTo(`/teacher/students/${student._id}`);
};

const sendMessage = (student) => {
  // TODO: Ouvrir la conversation avec l'étudiant
  console.log('Envoyer un message à:', student);
  navigateTo(`/messages?student=${student._id}`);
};

const scheduleCourse = (student) => {
  // TODO: Programmer un cours avec l'étudiant
  console.log('Programmer un cours avec:', student);
  navigateTo(`/teacher/schedule?student=${student._id}`);
};

const exportStudents = () => {
  // TODO: Exporter la liste des étudiants
  console.log('Exporter les étudiants');
};

// Recharger les données quand les filtres changent
watch([searchQuery, statusFilter, subjectFilter], () => {
  loadStudents();
}, { debounce: 300 });

// Lifecycle
onMounted(() => {
  loadStudents();
});
</script>
