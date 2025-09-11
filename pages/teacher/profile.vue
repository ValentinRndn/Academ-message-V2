<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header avec gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Mon Profil</h1>
            <p class="text-purple-100">Gérez vos informations personnelles et professionnelles</p>
          </div>
          <button 
            @click="isEditing = !isEditing" 
            class="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span class="flex items-center">
              <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ isEditing ? 'Annuler' : 'Modifier' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-red-800">Erreur</h3>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Profile content -->
    <div v-else-if="profile" class="space-y-8">
      <!-- Informations personnelles -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gray-50 px-8 py-6 border-b">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informations personnelles
          </h2>
        </div>
        
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Avatar et nom -->
            <div class="flex items-center space-x-6">
              <AvatarUpload
                v-model:avatar-url="profile.avatar"
                :size="'xl'"
                :disabled="!isEditing"
                :alt="profile.firstName + ' ' + profile.lastName"
                @upload-success="handleAvatarUploadSuccess"
                @upload-error="handleAvatarUploadError"
              />
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}</h3>
                <p class="text-gray-600">{{ profile.email }}</p>
                <div class="flex items-center mt-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Professeur
                  </span>
                  <span v-if="profile.isAvailableNow" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Disponible maintenant
                  </span>
                </div>
              </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Note moyenne</p>
                    <p class="text-xl font-bold text-gray-900">{{ profile.averageRating?.toFixed(1) || '0.0' }}/5</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="bg-green-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Sessions</p>
                    <p class="text-xl font-bold text-gray-900">{{ profile.sessionsCompleted || 0 }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Étudiants</p>
                    <p class="text-xl font-bold text-gray-900">{{ stats?.totalStudents || 0 }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="bg-yellow-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Avis</p>
                    <p class="text-xl font-bold text-gray-900">{{ profile.reviewCount || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bio et description -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gray-50 px-8 py-6 border-b">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bio et description
          </h2>
        </div>
        
        <div class="p-8">
          <div v-if="!isEditing">
            <p v-if="profile.bio" class="text-gray-700 leading-relaxed">{{ profile.bio }}</p>
            <p v-else class="text-gray-500 italic">Aucune bio renseignée</p>
          </div>
          
          <div v-else>
            <textarea
              v-model="editedProfile.bio"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Décrivez votre parcours, vos spécialités, votre approche pédagogique..."
            ></textarea>
            <p class="text-sm text-gray-500 mt-2">Cette description sera visible par les étudiants</p>
          </div>
        </div>
      </div>

      <!-- Informations professionnelles -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Matières enseignées -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-8 py-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Matières enseignées
            </h2>
          </div>
          
          <div class="p-8">
            <div v-if="!isEditing">
              <div v-if="profile.subjects && profile.subjects.length > 0" class="flex flex-wrap gap-2">
                <span 
                  v-for="subject in profile.subjects" 
                  :key="subject._id || subject"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {{ subject.name || subject }}
                </span>
              </div>
              <p v-else class="text-gray-500 italic">Aucune matière renseignée</p>
            </div>
            
            <div v-else>
              <div class="space-y-4">
                <div v-if="profile.subjects && profile.subjects.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="(subject, index) in profile.subjects" 
                    :key="subject._id || subject"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {{ subject.name || subject }}
                    <button 
                      @click="removeSubject(index)"
                      class="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                
                <div class="flex space-x-2">
                  <select 
                    v-model="newSubject"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Sélectionner une matière</option>
                    <option v-for="subject in filteredAvailableSubjects" :key="subject._id" :value="subject._id">
                      {{ subject.name }}
                    </option>
                  </select>
                  <button 
                    @click="addSubject"
                    :disabled="!newSubject"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarif horaire -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-8 py-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Tarif horaire
            </h2>
          </div>
          
          <div class="p-8">
            <div v-if="!isEditing">
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">{{ profile.hourlyRate || 0 }}€</span>
                <span class="text-gray-600 ml-2">/ heure</span>
              </div>
            </div>
            
            <div v-else>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="editedProfile.hourlyRate"
                  type="number"
                  min="0"
                  step="5"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0"
                />
                <span class="text-gray-600">€ / heure</span>
              </div>
              <p class="text-sm text-gray-500 mt-2">Définissez votre tarif horaire pour les cours</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Langues et expérience -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Langues parlées -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-8 py-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Langues parlées
            </h2>
          </div>
          
          <div class="p-8">
            <div v-if="!isEditing">
              <div v-if="profile.languages && profile.languages.length > 0" class="flex flex-wrap gap-2">
                <span 
                  v-for="language in profile.languages" 
                  :key="language"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {{ getLanguageName(language) }}
                </span>
              </div>
              <p v-else class="text-gray-500 italic">Aucune langue renseignée</p>
            </div>
            
            <div v-else>
              <div class="space-y-3">
                <div v-for="language in availableLanguages" :key="language.value" class="flex items-center">
                  <input
                    :id="language.value"
                    v-model="editedProfile.languages"
                    :value="language.value"
                    type="checkbox"
                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label :for="language.value" class="ml-3 text-sm text-gray-700">
                    {{ language.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expérience -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-8 py-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Expérience
            </h2>
          </div>
          
          <div class="p-8">
            <div v-if="!isEditing">
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">{{ profile.experience || 0 }}</span>
                <span class="text-gray-600 ml-2">années d'expérience</span>
              </div>
            </div>
            
            <div v-else>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="editedProfile.experience"
                  type="number"
                  min="0"
                  max="50"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0"
                />
                <span class="text-gray-600">années</span>
              </div>
              <p class="text-sm text-gray-500 mt-2">Nombre d'années d'expérience dans l'enseignement</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="isEditing" class="flex justify-end space-x-4">
        <button 
          @click="cancelEdit"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button 
          @click="saveProfile"
          :disabled="saving"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="saving" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sauvegarde...
          </span>
          <span v-else>Sauvegarder</span>
        </button>
      </div>
      
      <!-- Section Sécurité -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gray-50 px-8 py-6 border-b">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Sécurité
          </h2>
        </div>
        
        <div class="p-8">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Mot de passe</h3>
              <p class="text-gray-600 mt-1">Changez votre mot de passe pour sécuriser votre compte</p>
            </div>
            <button 
              @click="showChangePasswordModal = true"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      <!-- Section Notifications -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gray-50 px-8 py-6 border-b">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 006.73 3H11a4 4 0 014 4v1.5a2.5 2.5 0 002.5 2.5H20a2 2 0 012 2v8a2 2 0 01-2 2H6.73a4 4 0 01-2.54-.81L4.19 4.19z" />
            </svg>
            Notifications
          </h2>
        </div>
        
        <div class="p-8">
          <NotificationToggle />
        </div>
      </div>

      <!-- Modal de changement de mot de passe -->
      <ChangePasswordModal 
        :is-open="showChangePasswordModal"
        @close="showChangePasswordModal = false"
        @success="handlePasswordChangeSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeacherProfile } from '~/composables/useTeacherProfile'
import AvatarUpload from '~/components/AvatarUpload.vue'
import NotificationToggle from '~/components/NotificationToggle.vue'
import ChangePasswordModal from '~/components/ChangePasswordModal.vue'

// L'authentification est gérée par le middleware global
definePageMeta({
});

// État réactif
const isEditing = ref(false);
const saving = ref(false);
const profile = ref(null);
const editedProfile = ref({});
const loading = ref(true);
const error = ref(null);
const stats = ref(null);
const availableSubjects = ref([]);
const newSubject = ref('');
const showChangePasswordModal = ref(false);

// Computed properties
const filteredAvailableSubjects = computed(() => {
  // S'assurer que les données nécessaires sont disponibles
  if (!availableSubjects.value || !editedProfile.value || !editedProfile.value.subjects) {
    return availableSubjects.value || [];
  }
  
  return availableSubjects.value.filter(subject => {
    // Filtrer les matières déjà sélectionnées dans editedProfile
    return !editedProfile.value.subjects.some(selectedSubject => {
      // Gérer le cas où selectedSubject peut être un string ID ou un objet avec _id
      const selectedId = typeof selectedSubject === 'string' ? selectedSubject : selectedSubject._id;
      return selectedId === subject._id;
    });
  });
});

// Langues disponibles
const availableLanguages = [
  { value: 'french', label: 'Français' },
  { value: 'english', label: 'Anglais' },
  { value: 'spanish', label: 'Espagnol' },
  { value: 'german', label: 'Allemand' },
  { value: 'italian', label: 'Italien' },
  { value: 'chinese', label: 'Chinois' },
  { value: 'japanese', label: 'Japonais' },
  { value: 'arabic', label: 'Arabe' }
];

// Fonctions utilitaires
const getLanguageName = (code) => {
  const language = availableLanguages.find(lang => lang.value === code);
  return language ? language.label : code;
};

const addSubject = () => {
  console.log('🔍 addSubject appelée avec newSubject.value:', newSubject.value);
  console.log('📋 editedProfile.value.subjects avant ajout:', editedProfile.value.subjects);
  
  if (!newSubject.value) {
    console.log('❌ Aucune matière sélectionnée');
    return;
  }

  // Trouver l'objet matière complet
  const selectedSubject = availableSubjects.value.find(subject => subject._id === newSubject.value);
  if (!selectedSubject) {
    console.log('❌ Matière introuvable:', newSubject.value);
    console.log('🎓 Matières disponibles:', availableSubjects.value);
    return;
  }
  
  console.log('✅ Matière trouvée:', selectedSubject);

  // Initialiser le tableau si nécessaire
  if (!editedProfile.value.subjects) {
    editedProfile.value.subjects = [];
  }

  // Vérifier si la matière n'est pas déjà ajoutée
  const isAlreadyAdded = editedProfile.value.subjects.some(subject => {
    if (typeof subject === 'string') {
      return subject === newSubject.value;
    } else if (subject._id) {
      return subject._id === newSubject.value;
    }
    return false;
  });

  if (isAlreadyAdded) {
    console.log('Matière déjà ajoutée');
    return;
  }

  // Ajouter la matière (on peut choisir d'ajouter l'objet complet ou juste l'ID)
  editedProfile.value.subjects.push({
    _id: selectedSubject._id,
    name: selectedSubject.name
  });
  
  console.log('✅ Matière ajoutée:', selectedSubject.name);
  console.log('📋 editedProfile.value.subjects après ajout:', editedProfile.value.subjects);
  newSubject.value = '';
};

const removeSubject = (index) => {
  editedProfile.value.subjects.splice(index, 1);
};

const cancelEdit = () => {
  isEditing.value = false;
  editedProfile.value = { ...profile.value };
  newSubject.value = '';
};

const saveProfile = async () => {
  try {
    saving.value = true;
    
    // Préparer les données pour la sauvegarde
    const dataToSave = { ...editedProfile.value };
    
    // Convertir les matières en IDs seulement
    if (dataToSave.subjects && Array.isArray(dataToSave.subjects)) {
      dataToSave.subjects = dataToSave.subjects.map(subject => {
        // Si c'est déjà un string ID, le garder tel quel
        if (typeof subject === 'string') {
          return subject;
        }
        // Si c'est un objet avec _id, extraire l'ID
        if (subject._id) {
          return subject._id;
        }
        // Sinon, retourner tel quel (sécurité)
        return subject;
      });
    }
    
    console.log('Données à sauvegarder:', dataToSave);
    
    const response = await $fetch('/api/teachers/my-profile', {
      method: 'PUT',
      body: dataToSave
    });
    
    if (response.teacher) {
      profile.value = response.teacher;
      isEditing.value = false;
      newSubject.value = '';
      
      // Afficher une notification de succès
      // TODO: Intégrer le système de notifications
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err);
    error.value = err.data?.message || 'Erreur lors de la sauvegarde du profil';
  } finally {
    saving.value = false;
  }
};

const handleAvatarUploadSuccess = (avatarUrl) => {
  // L'avatar a été mis à jour automatiquement via v-model
  console.log('Avatar mis à jour avec succès:', avatarUrl);
  // TODO: Afficher une notification de succès
};

const handleAvatarUploadError = (errorMessage) => {
  console.error('Erreur upload avatar:', errorMessage);
  // TODO: Afficher une notification d'erreur
};

const handlePasswordChangeSuccess = () => {
  console.log('Mot de passe changé avec succès');
  // Le modal se ferme automatiquement et la notification est affichée par le composant
};

// Charger les données
const loadProfile = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const [profileResponse, statsResponse, subjectsResponse] = await Promise.all([
      $fetch('/api/teachers/my-profile'),
      $fetch('/api/teachers/students'),
      $fetch('/api/subjects')
    ]);
    
    if (profileResponse.teacher) {
      console.log('📋 Profil teacher récupéré:', profileResponse.teacher);
      console.log('📚 Matières du profil:', profileResponse.teacher.subjects);
      
      profile.value = profileResponse.teacher;
      editedProfile.value = { ...profileResponse.teacher };
      
      console.log('✏️ editedProfile initialisé:', editedProfile.value);
      console.log('📚 Matières dans editedProfile:', editedProfile.value.subjects);
    }
    
    if (statsResponse) {
      stats.value = statsResponse;
    }
    
    if (subjectsResponse) {
      console.log('🎓 Matières disponibles récupérées:', subjectsResponse.subjects);
      availableSubjects.value = subjectsResponse.subjects || [];
    }
  } catch (err) {
    console.error('Erreur lors du chargement du profil:', err);
    error.value = err.data?.message || 'Erreur lors du chargement du profil';
  } finally {
    loading.value = false;
  }
};

// Charger les données au montage
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}
</style>
