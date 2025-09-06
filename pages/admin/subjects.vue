<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestion des matières</h1>
          <p class="text-gray-600 mt-2">Gérer les matières disponibles sur la plateforme</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Ajouter une matière
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Erreur</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Liste des matières -->
      <div v-else class="bg-white shadow-sm rounded-lg">
        <!-- En-tête du tableau -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">
              {{ subjects.length }} matière{{ subjects.length > 1 ? 's' : '' }}
            </h2>
            <div class="flex items-center space-x-4">
              <!-- Filtre par catégorie -->
              <select
                v-model="selectedCategory"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Toutes les catégories</option>
                <option value="sciences">Sciences</option>
                <option value="languages">Langues</option>
                <option value="arts">Arts</option>
                <option value="humanities">Sciences Humaines</option>
                <option value="technology">Technologie</option>
                <option value="other">Autre</option>
              </select>
              <!-- Barre de recherche -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 text-sm"
                >
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matière
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professeurs
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="subject in filteredSubjects" :key="subject._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-purple-600">
                          {{ subject.icon || subject.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ subject.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getCategoryClass(subject.category)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getCategoryName(subject.category) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ subject.description || 'Aucune description' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ subject.teacherCount || 0 }} professeur{{ (subject.teacherCount || 0) > 1 ? 's' : '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(subject.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editSubject(subject)"
                      class="text-purple-600 hover:text-purple-900"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteSubject(subject)"
                      class="text-red-600 hover:text-red-900"
                      :disabled="subject.teacherCount > 0"
                      :class="subject.teacherCount > 0 ? 'opacity-50 cursor-not-allowed' : ''"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- État vide -->
        <div v-if="filteredSubjects.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13v13m0-13c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253v13M3 19.253v13M3 19.253c1.168-.776 2.754-1.253 4.5-1.253s3.332.477 4.5 1.253m3-13v13M21 19.253v13c-1.168-.776-2.754-1.253-4.5-1.253s-3.332.477-4.5 1.253"></path>
          </svg>
          <h3 class="mt-4 text-sm font-medium text-gray-900">Aucune matière trouvée</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchQuery || selectedCategory ? 'Aucun résultat pour ces critères.' : 'Commencez par ajouter une matière.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Créer/Modifier matière -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showCreateModal ? 'Ajouter une matière' : 'Modifier la matière' }}
          </h3>
          
          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom de la matière *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Mathématiques"
              >
            </div>

            <!-- Catégorie -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="sciences">Sciences</option>
                <option value="languages">Langues</option>
                <option value="arts">Arts</option>
                <option value="humanities">Sciences Humaines</option>
                <option value="technology">Technologie</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Description de la matière..."
              ></textarea>
            </div>

            <!-- Icône -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Icône (emoji ou caractère)
              </label>
              <input
                v-model="form.icon"
                type="text"
                maxlength="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="📚"
              >
            </div>

            <!-- Boutons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {{ submitting ? 'Enregistrement...' : (showCreateModal ? 'Créer' : 'Modifier') }}
              </button>
            </div>
          </form>
        </div>
      </div>

    <!-- Toast notifications -->
    <div
      v-if="toast.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-md',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <div class="flex items-center">
        <svg v-if="toast.type === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Métadonnées
definePageMeta({
  title: 'Gestion des matières'
})

// État
const loading = ref(true)
const error = ref('')
const subjects = ref([])

// Filtres
const searchQuery = ref('')
const selectedCategory = ref('')

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const submitting = ref(false)

// Formulaire
const form = ref({
  name: '',
  category: 'other',
  description: '',
  icon: ''
})

const editingSubject = ref(null)

// Toast
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Computed
const filteredSubjects = computed(() => {
  let filtered = subjects.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(subject => 
      subject.name.toLowerCase().includes(query) ||
      subject.description.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(subject => subject.category === selectedCategory.value)
  }

  return filtered
})

// Méthodes
const loadSubjects = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const data = await $fetch('/api/admin/subjects', {
      credentials: 'include'
    })
    
    subjects.value = data.subjects
  } catch (err) {
    error.value = err.data?.message || 'Erreur lors du chargement des matières'
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  try {
    submitting.value = true
    
    const url = showCreateModal.value ? '/api/admin/subjects' : `/api/admin/subjects/${editingSubject.value._id}`
    const method = showCreateModal.value ? 'POST' : 'PUT'
    
    await $fetch(url, {
      method,
      body: form.value,
      credentials: 'include'
    })
    
    showToast('success', showCreateModal.value ? 'Matière créée avec succès' : 'Matière modifiée avec succès')
    closeModal()
    await loadSubjects()
  } catch (err) {
    showToast('error', err.data?.message || 'Erreur lors de la sauvegarde')
  } finally {
    submitting.value = false
  }
}

const editSubject = (subject) => {
  editingSubject.value = subject
  form.value = {
    name: subject.name,
    category: subject.category,
    description: subject.description || '',
    icon: subject.icon || ''
  }
  showEditModal.value = true
}

const deleteSubject = async (subject) => {
  if (subject.teacherCount > 0) {
    showToast('error', 'Impossible de supprimer une matière utilisée par des professeurs')
    return
  }
  
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`)) {
    return
  }
  
  try {
    await $fetch(`/api/admin/subjects/${subject._id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    
    showToast('success', 'Matière supprimée avec succès')
    await loadSubjects()
  } catch (err) {
    showToast('error', err.data?.message || 'Erreur lors de la suppression')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingSubject.value = null
  form.value = {
    name: '',
    category: 'other',
    description: '',
    icon: ''
  }
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

const getCategoryName = (category) => {
  const names = {
    sciences: 'Sciences',
    languages: 'Langues',
    arts: 'Arts',
    humanities: 'Sciences Humaines',
    technology: 'Technologie',
    other: 'Autre'
  }
  return names[category] || 'Autre'
}

const getCategoryClass = (category) => {
  const classes = {
    sciences: 'bg-purple-100 text-purple-800',
    languages: 'bg-green-100 text-green-800',
    arts: 'bg-purple-100 text-purple-800',
    humanities: 'bg-yellow-100 text-yellow-800',
    technology: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadSubjects()
})
</script>