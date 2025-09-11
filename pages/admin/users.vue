<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600 mt-2">Manage all platform users</p>
        </div>
        <div class="flex space-x-3">
          <NuxtLink 
            to="/admin/create-teacher" 
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create User
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nom, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
          <select
            v-model="roleFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="teacher">Professeur</option>
            <option value="student">Étudiant</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="pending">En attente</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total utilisateurs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Professeurs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalTeachers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-50 rounded-lg">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Étudiants</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalStudents }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingUsers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Teachers pending approval -->
    <div v-if="pendingTeachers.length > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-orange-800">
              Teachers pending approval ({{ pendingTeachers.length }})
            </h3>
            <p class="text-sm text-orange-600">
              Ces professeurs attendent une approbation pour accéder à la plateforme.
            </p>
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <div v-for="teacher in pendingTeachers" :key="teacher._id" 
             class="bg-white rounded-lg border border-orange-200 p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span class="text-sm font-medium text-orange-700">
                  {{ teacher.firstName?.charAt(0) }}{{ teacher.lastName?.charAt(0) }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ teacher.firstName }} {{ teacher.lastName }}
              </div>
              <div class="text-sm text-gray-500">{{ teacher.email }}</div>
              <div class="text-xs text-gray-400">
                Inscrit le {{ formatDate(teacher.createdAt) }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="viewUser(teacher)"
              class="px-3 py-1 text-sm border border-orange-200 text-orange-700 rounded-md hover:bg-orange-50"
            >
              Voir profil
            </button>
            <button
              @click="approveTeacher(teacher)"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Approuver
            </button>
            <button
              @click="rejectTeacher(teacher)"
              class="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Liste des utilisateurs</h2>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Chargement...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="p-8 text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p class="text-gray-500">No users found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(user.status)">
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastLogin ? formatDate(user.lastLogin) : 'Jamais' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewUser(user)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Voir les détails"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editUser(user)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <!-- Bouton d'approbation pour professeurs en attente -->
                  <button
                    v-if="user.role === 'teacher' && user.status === 'pending'"
                    @click="approveTeacher(user)"
                    class="text-green-600 hover:text-green-800"
                    title="Approve this teacher"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <!-- Bouton toggle statut pour les autres cas -->
                  <button
                    v-else
                    @click="toggleUserStatus(user)"
                    :class="user.status === 'active' ? 'text-orange-500 hover:text-orange-700' : 'text-green-600 hover:text-green-800'"
                    :title="user.status === 'active' ? 'Désactiver' : 'Activer'"
                  >
                    <svg v-if="user.status === 'active'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-900"
                    title="Supprimer"
                    :disabled="user._id === $user?._id"
                    :class="{ 'opacity-50 cursor-not-allowed': user._id === $user?._id }"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredUsers.length }} utilisateurs
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-purple-200 text-purple-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
            >
              Précédent
            </button>
            <span class="px-3 py-1 text-sm text-purple-700">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-purple-200 text-purple-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails utilisateur améliorée -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Header avec photo de profil -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                {{ selectedUser?.firstName?.charAt(0) }}{{ selectedUser?.lastName?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</h2>
                <p class="text-purple-100">{{ selectedUser?.email }}</p>
                <div class="flex items-center space-x-3 mt-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                    {{ getRoleLabel(selectedUser?.role) }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="selectedUser?.status === 'active' ? 'bg-green-100 text-green-800' : selectedUser?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'">
                    {{ getStatusLabel(selectedUser?.status) }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="closeUserModal" class="text-white hover:text-gray-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenu défilable -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div class="p-6 space-y-6">
            
            <!-- Personal Information -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Prénom</label>
                  <p class="text-lg text-gray-900">{{ selectedUser?.firstName }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Nom</label>
                  <p class="text-lg text-gray-900">{{ selectedUser?.lastName }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Email</label>
                  <p class="text-lg text-gray-900">{{ selectedUser?.email }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Téléphone</label>
                  <p class="text-lg text-gray-900">{{ selectedUser?.phone || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Date d'inscription</label>
                  <p class="text-lg text-gray-900">{{ formatDate(selectedUser?.createdAt) }}</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500">Dernière connexion</label>
                  <p class="text-lg text-gray-900">{{ selectedUser?.lastLogin ? formatDate(selectedUser.lastLogin) : 'Jamais' }}</p>
                </div>
              </div>
            </div>

            <!-- Statistiques -->
            <div v-if="userDetails?.stats" class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistiques
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold text-purple-600">{{ userDetails.stats.accountAge }}</div>
                  <div class="text-sm text-gray-500 mt-1">Jours d'ancienneté</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold text-purple-600">{{ userDetails.stats.lastLoginAgo || 'N/A' }}</div>
                  <div class="text-sm text-gray-500 mt-1">Jours depuis dernière connexion</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold" :class="userDetails.stats.isNewUser ? 'text-green-600' : 'text-gray-400'">
                    {{ userDetails.stats.isNewUser ? 'Oui' : 'Non' }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">Nouvel utilisateur</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold" :class="userDetails.stats.hasEverLoggedIn ? 'text-green-600' : 'text-red-600'">
                    {{ userDetails.stats.hasEverLoggedIn ? 'Oui' : 'Non' }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">Déjà connecté</div>
                </div>
              </div>
            </div>

            <!-- Teacher Details -->
            <div v-if="selectedUser?.role === 'teacher'" class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Teacher Details
              </h3>
              <div class="space-y-4">
                <div v-if="selectedUser?.bio" class="bg-white p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500 mb-2">Biographie</label>
                  <p class="text-gray-900 leading-relaxed">{{ selectedUser.bio }}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded-lg">
                    <label class="block text-sm font-medium text-gray-500">Spécialisation</label>
                    <p class="text-lg text-gray-900">{{ selectedUser?.specialization || 'Non renseignée' }}</p>
                  </div>
                  <div class="bg-white p-3 rounded-lg">
                    <label class="block text-sm font-medium text-gray-500">Expérience</label>
                    <p class="text-lg text-gray-900">{{ selectedUser?.experience || 0 }} années</p>
                  </div>
                </div>

                <div v-if="selectedUser?.subjects?.length" class="bg-white p-4 rounded-lg">
                  <label class="block text-sm font-medium text-gray-500 mb-2">Matières enseignées</label>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="subject in selectedUser.subjects" :key="subject" 
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {{ subject }}
                    </span>
                  </div>
                </div>

                <div v-if="userDetails?.teacherDetails" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-600">{{ userDetails.teacherDetails.hourlyRate || 0 }}€</div>
                    <div class="text-sm text-gray-500">Tarif/heure</div>
                  </div>
                  <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-600">{{ userDetails.teacherDetails.averageRating || 0 }}/5</div>
                    <div class="text-sm text-gray-500">Note moyenne</div>
                  </div>
                  <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">{{ userDetails.teacherDetails.sessionsCompleted || 0 }}</div>
                    <div class="text-sm text-gray-500">Sessions complétées</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions pour professeurs en attente -->
            <div v-if="selectedUser?.role === 'teacher' && selectedUser?.status === 'pending'" 
                 class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-orange-800 mb-3">Actions d'approbation</h3>
              <div class="flex space-x-3">
                <button
                  @click="approveTeacher(selectedUser)"
                  class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve this teacher
                </button>
                <button
                  @click="rejectTeacher(selectedUser)"
                  class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject this teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition utilisateur -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Modifier l'utilisateur</h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveUserChanges" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom *</label>
                <input
                  v-model="editForm.firstName"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom *</label>
                <input
                  v-model="editForm.lastName"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  v-model="editForm.phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Rôle</label>
                <select
                  v-model="editForm.role"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Professeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  v-model="editForm.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="pending">En attente</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <div v-if="editForm.role === 'teacher'" class="space-y-4 border-t pt-4">
              <h4 class="text-md font-medium text-gray-900">Teacher Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Spécialisation</label>
                  <input
                    v-model="editForm.specialization"
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Expérience (années)</label>
                  <input
                    v-model.number="editForm.experience"
                    type="number"
                    min="0"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  v-model="editForm.bio"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {{ loading ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2">Supprimer l'utilisateur</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer l'utilisateur 
              <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong> ?
              Cette action est irréversible.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <div class="flex justify-center space-x-3">
              <button
                @click="closeDeleteModal"
                class="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                @click="confirmDeleteUser"
                :disabled="loading"
                class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {{ loading ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de rejet de professeur -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2">Reject Teacher</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir rejeter la demande de 
              <strong>{{ userToReject?.firstName }} {{ userToReject?.lastName }}</strong> ?
              Cette action supprimera définitivement le compte et enverra un email de notification.
            </p>
            
            <div class="text-left">
              <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                id="rejection-reason"
                v-model="rejectionReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder="Expliquez brièvement pourquoi cette demande est rejetée..."
              ></textarea>
            </div>
          </div>
          <div class="items-center px-4 py-3">
            <div class="flex justify-center space-x-3">
              <button
                @click="closeRejectModal"
                class="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                @click="confirmRejectTeacher"
                :disabled="loading"
                class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {{ loading ? 'Rejecting...' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification et vérification du rôle admin
definePageMeta({
  title: 'Gestion des utilisateurs'
});

// Vérifier que l'utilisateur est admin
const { user, initAuth } = useAuth();

// État réactif
const loading = ref(true);
const users = ref([]);
const stats = ref({
  totalUsers: 0,
  totalTeachers: 0,
  totalStudents: 0,
  pendingUsers: 0
});

// États des modales
const showUserModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showRejectModal = ref(false);
const selectedUser = ref(null);
const userDetails = ref(null);
const userToDelete = ref(null);
const userToReject = ref(null);
const rejectionReason = ref('');

// Formulaire d'édition
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  status: '',
  specialization: '',
  experience: 0,
  bio: ''
});

// Filtres
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    loading.value = true;
    
    // Vérifier l'authentification d'abord
    const isAuthenticated = await initAuth();
    if (!isAuthenticated) {
      console.error('Utilisateur non authentifié');
      return;
    }
    
    // Vérifier que l'utilisateur est admin
    if (user.value?.role !== 'admin') {
      console.error('Accès réservé aux administrateurs');
      return;
    }
    
    const response = await $fetch('/api/admin/users');
    users.value = response.users;
    stats.value = response.stats;
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    const { showError } = useToast();
    showError('Erreur', 'Impossible de charger les utilisateurs');
  } finally {
    loading.value = false;
  }
};

// Teachers pending approval
const pendingTeachers = computed(() => {
  return users.value.filter(user => user.role === 'teacher' && user.status === 'pending');
});

// Utilisateurs filtrés
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRole = !roleFilter.value || user.role === roleFilter.value;
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredUsers.value.length));
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, endIndex.value);
});

// Réinitialiser les filtres
const resetFilters = () => {
  searchQuery.value = '';
  roleFilter.value = '';
  statusFilter.value = '';
  currentPage.value = 1;
};

// Méthodes utilitaires
const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-purple-200 text-purple-900',
    teacher: 'bg-purple-100 text-purple-700',
    student: 'bg-purple-50 text-purple-600'
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Admin',
    teacher: 'Professeur',
    student: 'Étudiant'
  };
  return labels[role] || role;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-purple-50 text-purple-600',
    inactive: 'bg-gray-100 text-gray-600',
    pending: 'bg-purple-100 text-purple-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status) => {
  const labels = {
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente'
  };
  return labels[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Actions des modales
const closeUserModal = () => {
  showUserModal.value = false;
  selectedUser.value = null;
  userDetails.value = null;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedUser.value = null;
  editForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    specialization: '',
    experience: 0,
    bio: ''
  };
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  userToReject.value = null;
  rejectionReason.value = '';
};

// Actions
const viewUser = async (user) => {
  try {
    loading.value = true;
    selectedUser.value = user;
    showUserModal.value = true;

    // Récupérer les détails complets de l'utilisateur
    const response = await $fetch(`/api/admin/users/${user._id}/details`);
    userDetails.value = response;
    
    // Mettre à jour les informations de base avec les détails récupérés
    if (response.user) {
      selectedUser.value = response.user;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    const { showError } = useToast();
    showError('Erreur', 'Impossible de récupérer les détails de l\'utilisateur');
    closeUserModal();
  } finally {
    loading.value = false;
  }
};

const editUser = (user) => {
  selectedUser.value = user;
  
  // Pré-remplir le formulaire avec les données actuelles
  editForm.value = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || '',
    status: user.status || '',
    specialization: user.specialization || '',
    experience: user.experience || 0,
    bio: user.bio || ''
  };
  
  showEditModal.value = true;
};

const deleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const saveUserChanges = async () => {
  try {
    loading.value = true;
    
    const response = await $fetch(`/api/admin/users/${selectedUser.value._id}/update`, {
      method: 'PUT',
      body: editForm.value
    });

    if (response.success) {
      // Mettre à jour l'utilisateur dans la liste locale
      const userIndex = users.value.findIndex(u => u._id === selectedUser.value._id);
      if (userIndex !== -1) {
        users.value[userIndex] = { ...users.value[userIndex], ...response.user };
      }
      
      const { showSuccess } = useToast();
      showSuccess('Succès', response.message);
      closeEditModal();
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    const { showError } = useToast();
    showError('Erreur', error.data?.message || 'Erreur lors de la mise à jour');
  } finally {
    loading.value = false;
  }
};

const confirmDeleteUser = async () => {
  try {
    loading.value = true;
    
    const response = await $fetch(`/api/admin/users/${userToDelete.value._id}/delete`, {
      method: 'DELETE'
    });

    if (response.success) {
      // Retirer l'utilisateur de la liste locale
      users.value = users.value.filter(u => u._id !== userToDelete.value._id);
      
      // Mettre à jour les stats
      stats.value.totalUsers--;
      if (userToDelete.value.role === 'teacher') {
        stats.value.totalTeachers--;
      } else if (userToDelete.value.role === 'student') {
        stats.value.totalStudents--;
      }
      if (userToDelete.value.status === 'pending') {
        stats.value.pendingUsers--;
      }
      
      const { showSuccess } = useToast();
      showSuccess('Succès', response.message);
      closeDeleteModal();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    const { showError } = useToast();
    showError('Erreur', error.data?.message || 'Erreur lors de la suppression');
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const response = await $fetch(`/api/admin/users/${user._id}/status`, {
      method: 'PUT',
      body: { status: newStatus }
    });

    if (response.success) {
      user.status = newStatus;
      const { showSuccess } = useToast();
      showSuccess(
        'Status updated', 
        `L'utilisateur ${user.firstName} ${user.lastName} est maintenant ${newStatus === 'active' ? 'actif' : 'inactif'}`
      );
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    const { showError } = useToast();
    showError('Erreur', 'Impossible de mettre à jour le statut');
  }
};

const approveTeacher = async (user) => {
  try {
    loading.value = true;
    
    const response = await $fetch(`/api/admin/users/${user._id}/approve`, {
      method: 'PUT'
    });

    if (response.success) {
      // Mettre à jour l'utilisateur dans la liste locale
      const userIndex = users.value.findIndex(u => u._id === user._id);
      if (userIndex !== -1) {
        users.value[userIndex] = { ...users.value[userIndex], ...response.user };
      }
      
      // Mettre à jour les stats
      stats.value.pendingUsers--;
      
      const { showSuccess } = useToast();
      showSuccess('Professeur approuvé !', response.message);
      
      // Close details modal if open
      if (showUserModal.value) {
        closeUserModal();
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    const { showError } = useToast();
    showError('Erreur', error.data?.message || 'Erreur lors de l\'approbation du professeur');
  } finally {
    loading.value = false;
  }
};

const rejectTeacher = (user) => {
  userToReject.value = user;
  showRejectModal.value = true;
};

const confirmRejectTeacher = async () => {
  try {
    loading.value = true;
    
    const response = await $fetch(`/api/admin/users/${userToReject.value._id}/reject`, {
      method: 'PUT',
      body: {
        reason: rejectionReason.value
      }
    });

    if (response.success) {
      // Retirer l'utilisateur de la liste locale
      users.value = users.value.filter(u => u._id !== userToReject.value._id);
      
      // Mettre à jour les stats
      stats.value.totalUsers--;
      stats.value.totalTeachers--;
      stats.value.pendingUsers--;
      
      const { showSuccess } = useToast();
      showSuccess('Professeur rejeté', response.message);
      
      closeRejectModal();
      
      // Close details modal if open
      if (showUserModal.value) {
        closeUserModal();
      }
    }
  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    const { showError } = useToast();
    showError('Erreur', error.data?.message || 'Erreur lors du rejet du professeur');
  } finally {
    loading.value = false;
  }
};

// Surveiller les changements de filtres pour réinitialiser la pagination
watch([searchQuery, roleFilter, statusFilter], () => {
  currentPage.value = 1;
});

// Charger les données au montage
onMounted(() => {
  fetchUsers();
});
</script>
