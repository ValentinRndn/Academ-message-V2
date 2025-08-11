<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
    <!-- Background decorative elements -->
    <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
    
    <!-- Header section with animation -->
    <div class="relative animate-fade-in">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Trouvez Votre Professeur Idéal</h1>
      <p class="text-lg text-gray-600 mb-8">Connectez-vous avec des experts qualifiés dans toutes les matières pour exceller dans vos études</p>
    </div>
    
    <!-- Search and Filters with animation -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-100 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end gap-6 mb-6">
        <!-- Search -->
        <div class="flex-grow">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par nom, matière ou mot-clé..."
              class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              @keyup.enter="applyFilters"
            />
            <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Subject Filter -->
        <div class="w-full md:w-64">
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Matière</label>
          <div class="relative">
            <select
              id="subject"
              v-model="selectedSubject"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Toutes les matières</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Rating Filter -->
        <div class="w-full md:w-64">
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">Note minimum</label>
          <div class="relative">
            <select
              id="rating"
              v-model="minRating"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="0">Toutes les notes</option>
              <option value="3">3+ Étoiles</option>
              <option value="4">4+ Étoiles</option>
              <option value="5">5 Étoiles</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Price Filter -->
        <div class="w-full md:w-64">
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Gamme de prix</label>
          <div class="relative">
            <select
              id="price"
              v-model="priceRange"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Tous les prix</option>
              <option value="low">$25-$40</option>
              <option value="medium">$40-$60</option>
              <option value="high">$60+</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Advanced filters toggle -->
      <div class="flex items-center mb-4">
        <button 
          @click="showAdvancedFilters = !showAdvancedFilters" 
          class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center focus:outline-none transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {{ showAdvancedFilters ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés' }}
        </button>
        
        <button 
          v-if="hasActiveFilters"
          @click="clearFilters" 
          class="ml-auto text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center focus:outline-none transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Effacer tous les filtres
        </button>
      </div>
      
      <!-- Advanced filters -->
      <div v-if="showAdvancedFilters" class="border-t border-gray-200 pt-4 mb-4 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Availability -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
            <div class="space-y-2">
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.weekdays" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Jours de semaine</span>
              </label>
              <label class="inline-flex items-center ml-4 cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.weekends" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Weekends</span>
              </label>
              <label class="inline-flex items-center ml-4 cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.evenings" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Soirées</span>
              </label>
            </div>
          </div>
          
          <!-- Expérience -->
          <div>
            <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
            <div class="relative">
              <select
                id="experience"
                v-model="experienceLevel"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Toutes expériences</option>
                <option value="beginner">1-3 ans</option>
                <option value="intermediate">4-7 ans</option>
                <option value="expert">8+ ans</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Language -->
          <div>
            <label for="language" class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
            <div class="relative">
              <select
                id="language"
                v-model="language"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Toutes langues</option>
                <option value="english">Anglais</option>
                <option value="spanish">Espagnol</option>
                <option value="french">Français</option>
                <option value="mandarin">Mandarin</option>
                <option value="german">Allemand</option>
                <option value="japanese">Japonais</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 animate-fade-in">
        <div v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Recherche : {{ searchQuery }}
          <button @click="searchQuery = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="selectedSubject" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Matière : {{ getSubjectName(selectedSubject) }}
          <button @click="selectedSubject = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="minRating > 0" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Note : {{ minRating }}+ Stars
          <button @click="minRating = 0" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="priceRange" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Prix : {{ getPriceRangeLabel() }}
          <button @click="priceRange = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="experienceLevel" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Expérience : {{ getExpérienceLevelLabel() }}
          <button @click="experienceLevel = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="language" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Langue : {{ language.charAt(0).toUpperCase() + language.slice(1) }}
          <button @click="language = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="hasAvailabilityFilters" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Disponibilité : {{ getAvailabilityLabel() }}
          <button @click="clearAvailabilityFilters" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Results count and sorting options -->
    <div v-if="!loading && filteredTeachers.length > 0" class="flex flex-col sm:flex-row items-center justify-between mb-6 animate-fade-in-up">
      <p class="text-gray-600 mb-3 sm:mb-0">
        <span class="font-semibold text-gray-900">{{ filteredTeachers.length }}</span> enseignants trouvés correspondant à vos critères
      </p>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700">Trier par :</span>
        <select
          v-model="sortOption"
          class="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="relevance">Pertinence</option>
          <option value="rating">Meilleure note</option>
          <option value="price-asc">Prix : Croissant</option>
          <option value="price-desc">Prix : Décroissant</option>
          <option value="experience">Plus expérimenté</option>
        </select>
        
        <!-- View toggle -->
        <div class="ml-4 flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <button 
            @click="viewMode = 'grid'" 
            :class="[
              'p-1.5 rounded transition-colors', 
              viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="[
              'p-1.5 rounded transition-colors', 
              viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading state with animation -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 animate-fade-in">
      <div class="teacher-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p class="mt-6 text-gray-500">Recherche des meilleurs enseignants pour vous...</p>
    </div>
    
    <!-- Empty results state -->
    <div v-else-if="filteredTeachers.length === 0" class="bg-white shadow-lg rounded-xl p-10 text-center max-w-xl mx-auto animate-fade-in-up">
      <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun enseignant trouvé</h3>
      <p class="text-gray-600 mb-8">Nous n'avons trouvé aucun enseignant correspondant à vos critères de recherche. Essayez d'ajuster vos filtres ou de commencer une nouvelle recherche.</p>
      <button 
        @click="clearFilters" 
        class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Effacer tous les filtres
      </button>
    </div>
    
    <!-- Grid view for results -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      <div 
        v-for="(teacher, index) in sortedTeachers" 
        :key="teacher.id"
        class="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px] border border-gray-100"
        :style="`animation-delay: ${0.1 + (index * 0.05)}s`"
      >
        <!-- Teacher card -->
        <div class="relative">
          <!-- Available now indicator -->
          <div v-if="teacher.isAvailableNow" class="absolute top-4 right-4 bg-green-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium animate-pulse">
            Disponible maintenant
          </div>
          
          <div class="p-6">
            <div class="flex items-center">
              <!-- Teacher avatar -->
              <div class="relative">
                <img 
                  :src="teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                  :alt="`${teacher.firstName} ${teacher.lastName}`" 
                  class="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div 
                  class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white"
                  :class="teacher.isAvailableNow ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
              </div>
              
              <!-- Teacher name and rating -->
              <div class="ml-4">
                <h2 class="text-lg font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</h2>
                <div class="flex items-center mt-1">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-1 text-sm text-gray-600">
                    {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'No ratings' }} 
                    <span v-if="teacher.reviewCount" class="text-gray-500">({{ teacher.reviewCount }})</span>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Teacher bio -->
            <div class="mt-4">
              <p class="text-gray-600 line-clamp-3 text-sm">{{ teacher.bio || 'No bio available' }}</p>
            </div>
            
            <!-- Subjects taught -->
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-900 mb-2">Matières</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="subject in teacher.subjects.slice(0, 3)" 
                  :key="subject.id"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors animate-pop-in"
                >
                  {{ subject.name }}
                </span>
                <span 
                  v-if="teacher.subjects.length > 3"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  +{{ teacher.subjects.length - 3 }}
                </span>
              </div>
            </div>
            
            <!-- Expérience and other info -->
            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ getTeacherExpérience(teacher) }} Expérience
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ getTeacherSessions(teacher) }} Sessions
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {{ getTeacherLanguage(teacher) }}
              </div>
            </div>
            
            <!-- Price and action buttons -->
            <div class="mt-6 flex justify-between items-center">
              <div>
                <span class="text-xl font-bold text-gray-900">${{ teacher.hourlyRate || 50 }}</span>
                <span class="text-sm text-gray-500">/hour</span>
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="messageTeacher(teacher.id)"
                  class="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  title="Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <NuxtLink 
                  :to="`/teachers/${teacher.id}`" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-sm"
                >
                  Voir le profil
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- List view for results -->
    <div v-else class="space-y-6 animate-fade-in-up">
      <div 
        v-for="(teacher, index) in sortedTeachers" 
        :key="teacher.id"
        class="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] border border-gray-100 p-6"
        :style="`animation-delay: ${0.1 + (index * 0.05)}s`"
      >
        <div class="flex flex-col md:flex-row">
          <!-- Avatar and availability -->
          <div class="md:w-1/6 flex flex-col items-center">
            <div class="relative">
              <img 
                :src="teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                :alt="`${teacher.firstName} ${teacher.lastName}`" 
                class="h-24 w-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div 
                class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white"
                :class="teacher.isAvailableNow ? 'bg-green-500' : 'bg-gray-300'"
              ></div>
            </div>
            
            <div v-if="teacher.isAvailableNow" class="mt-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
              Disponible maintenant
            </div>
          </div>
          
          <!-- Teacher info -->
          <div class="md:w-3/6 mt-4 md:mt-0 md:ml-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 class="text-xl font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</h2>
              <div class="flex items-center mt-1 md:mt-0">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-1 text-sm text-gray-600">
                  {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'No ratings' }} 
                  <span v-if="teacher.reviewCount" class="text-gray-500">({{ teacher.reviewCount }})</span>
                </span>
              </div>
            </div>
            
            <div class="mt-3 flex flex-wrap gap-2">
              <span 
                v-for="subject in teacher.subjects.slice(0, 4)" 
                :key="subject.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ subject.name }}
              </span>
              <span 
                v-if="teacher.subjects.length > 4"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                +{{ teacher.subjects.length - 4 }}
              </span>
            </div>
            
            <p class="mt-3 text-gray-600 text-sm line-clamp-2">{{ teacher.bio || 'No bio available' }}</p>
            
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ getTeacherExpérience(teacher) }} Expérience
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ getTeacherSessions(teacher) }} Sessions
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {{ getTeacherLanguage(teacher) }}
              </div>
            </div>
          </div>
          
          <!-- Price and action buttons -->
          <div class="md:w-2/6 mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end justify-between">
            <div class="flex items-end">
              <span class="text-2xl font-bold text-gray-900">${{ teacher.hourlyRate || 50 }}</span>
              <span class="text-sm text-gray-500 ml-1">/hour</span>
            </div>
            
            <div class="mt-4 flex flex-col space-y-2">
              <NuxtLink 
                :to="`/teachers/${teacher.id}`" 
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-sm"
              >
                Voir le profil
              </NuxtLink>
              
              <button 
                @click="messageTeacher(teacher.id)"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="!loading && filteredTeachers.length > 0" class="mt-10 flex justify-center animate-fade-in">
      <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button 
          @click="currentPage > 1 ? currentPage-- : null"
          :disabled="currentPage === 1"
          :class="[
            'relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors',
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700'
          ]"
        >
          <span class="sr-only">Précédent</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page"
          :class="[
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors',
            currentPage === page 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <button 
          @click="currentPage < totalPages ? currentPage++ : null"
          :disabled="currentPage === totalPages"
          :class="[
            'relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors',
            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700'
          ]"
        >
          <span class="sr-only">Suivant</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTeachers } from '~/composables/useTeachers';

const router = useRouter();

// Utiliser le composable useTeachers
const {
  teachers: teachersData,
  filteredTeachers: filteredTeachersData,
  loading: teachersLoading,
  filters: teachersFilters,
  subjects: teachersSubjects,
  fetchTeachers,
  fetchSubjects,
  applyFilters: applyTeachersFilters,
  clearFilters: clearTeachersFilters
} = useTeachers();

// State
const searchQuery = ref('');
const selectedSubject = ref('');
const minRating = ref(0);
const loading = ref(true);
const teachers = ref([]);
const subjects = ref([]);
const priceRange = ref('');
const language = ref('');
const experienceLevel = ref('');
const viewMode = ref('grid');
const showAdvancedFilters = ref(false);
const availabilityFilters = ref({
  weekdays: false,
  weekends: false,
  evenings: false
});
const currentPage = ref(1);
const itemsPerPage = 9;
const sortOption = ref('relevance');

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
    selectedSubject.value || 
    minRating.value > 0 || 
    priceRange.value || 
    language.value || 
    experienceLevel.value || 
    hasAvailabilityFilters.value;
});

const hasAvailabilityFilters = computed(() => {
  return availabilityFilters.value.weekdays || 
    availabilityFilters.value.weekends || 
    availabilityFilters.value.evenings;
});

const filteredTeachers = computed(() => {
  let result = [...teachers.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const hasNameMatch = fullName.includes(query);
      const hasSubjectMatch = teacher.subjects.some(subject => subject.name.toLowerCase().includes(query));
      const hasBioMatch = teacher.bio && teacher.bio.toLowerCase().includes(query);
      return hasNameMatch || hasSubjectMatch || hasBioMatch;
    });
  }
  
  // Apply subject filter
  if (selectedSubject.value) {
    result = result.filter(teacher => 
      teacher.subjects.some(subject => subject.id === selectedSubject.value)
    );
  }
  
  // Apply rating filter
  if (minRating.value > 0) {
    result = result.filter(teacher => (teacher.averageRating || 0) >= minRating.value);
  }
  
  // Apply price filter
  if (priceRange.value) {
    result = result.filter(teacher => {
      const rate = teacher.hourlyRate || 50;
      if (priceRange.value === 'low') return rate >= 25 && rate <= 40;
      if (priceRange.value === 'medium') return rate > 40 && rate <= 60;
      if (priceRange.value === 'high') return rate > 60;
      return true;
    });
  }
  
  // Apply language filter
  if (language.value) {
    result = result.filter(teacher => {
      if (!teacher.languages) return false;
      return teacher.languages.includes(language.value);
    });
  }
  
  // Apply experience filter
  if (experienceLevel.value) {
    result = result.filter(teacher => {
      const experience = teacher.experience || 0;
      if (experienceLevel.value === 'beginner') return experience >= 1 && experience <= 3;
      if (experienceLevel.value === 'intermediate') return experience >= 4 && experience <= 7;
      if (experienceLevel.value === 'expert') return experience >= 8;
      return true;
    });
  }
  
  // Apply availability filters
  if (hasAvailabilityFilters.value) {
    result = result.filter(teacher => {
      if (!teacher.availability) return false;
      
      if (availabilityFilters.value.weekdays) {
        const hasWeekdays = teacher.availability.some(a => a.dayOfWeek >= 1 && a.dayOfWeek <= 5);
        if (!hasWeekdays) return false;
      }
      
      if (availabilityFilters.value.weekends) {
        const hasWeekends = teacher.availability.some(a => a.dayOfWeek === 0 || a.dayOfWeek === 6);
        if (!hasWeekends) return false;
      }
      
      if (availabilityFilters.value.evenings) {
        const hasEvenings = teacher.availability.some(a => {
          const endTime = new Date(`2000-01-01T${a.endTime}`);
          const eveningStart = new Date(`2000-01-01T17:00:00`);
          return endTime >= eveningStart;
        });
        if (!hasEvenings) return false;
      }
      
      return true;
    });
  }
  
  return result;
});

// Apply sorting and pagination
const sortedTeachers = computed(() => {
  let sorted = [...filteredTeachers.value];
  
  // Apply sorting
  if (sortOption.value === 'rating') {
    sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  } else if (sortOption.value === 'price-asc') {
    sorted.sort((a, b) => (a.hourlyRate || 50) - (b.hourlyRate || 50));
  } else if (sortOption.value === 'price-desc') {
    sorted.sort((a, b) => (b.hourlyRate || 50) - (a.hourlyRate || 50));
  } else if (sortOption.value === 'experience') {
    sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0));
  }
  
  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sorted.length);
  
  return sorted.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTeachers.value.length / itemsPerPage));
});

// Methods
const clearFilters = async () => {
  searchQuery.value = '';
  selectedSubject.value = '';
  minRating.value = 0;
  priceRange.value = '';
  language.value = '';
  experienceLevel.value = '';
  clearAvailabilityFilters();
  currentPage.value = 1;
  
  // Utiliser le composable pour réinitialiser les filtres
  await clearTeachersFilters();
  teachers.value = teachersData.value;
};

const clearAvailabilityFilters = () => {
  availabilityFilters.value.weekdays = false;
  availabilityFilters.value.weekends = false;
  availabilityFilters.value.evenings = false;
};

const getSubjectName = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId);
  return subject ? subject.name : '';
};

const getPriceRangeLabel = () => {
  if (priceRange.value === 'low') return '$25-$40';
  if (priceRange.value === 'medium') return '$40-$60';
  if (priceRange.value === 'high') return '$60+';
  return '';
};

const getExpérienceLevelLabel = () => {
  if (experienceLevel.value === 'beginner') return '1-3 ans';
  if (experienceLevel.value === 'intermediate') return '4-7 ans';
  if (experienceLevel.value === 'expert') return '8+ ans';
  return '';
};

const getAvailabilityLabel = () => {
  const labels = [];
  if (availabilityFilters.value.weekdays) labels.push('Jours de semaine');
  if (availabilityFilters.value.weekends) labels.push('Weekends');
  if (availabilityFilters.value.evenings) labels.push('Soirées');
  return labels.join(', ');
};

const getTeacherExpérience = (teacher) => {
  return `${teacher.experience || 5}+ ans`;
};

const getTeacherSessions = (teacher) => {
  return `${teacher.sessionsCompleted || (Math.floor(Math.random() * 50) + 10)}+`;
};

const getTeacherLanguage = (teacher) => {
  if (teacher.languages && teacher.languages.length > 0) {
    return teacher.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
  }
  return 'Anglais';
};

const applyFilters = async () => {
  console.log('Applying filters...');
  currentPage.value = 1;
  
  // Synchroniser les filtres et appliquer
  syncFilters();
  await applyTeachersFilters();
  teachers.value = teachersData.value;
};

const messageTeacher = (teacherId) => {
  router.push(`/messages?teacher=${teacherId}`);
};

// Utiliser le composable pour récupérer les sujets
const fetchSubjectsLocal = async () => {
  try {
    const fetchedSubjects = await fetchSubjects();
    subjects.value = fetchedSubjects || teachersSubjects.value;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    subjects.value = [];
  }
};

// Utiliser le composable pour récupérer les enseignants
const fetchTeachersLocal = async () => {
  loading.value = true;
  
  try {
    // Synchroniser les filtres avant de récupérer les enseignants
    syncFilters();
    await fetchTeachers();
    teachers.value = teachersData.value;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    teachers.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch for changes to reset pagination
watch([searchQuery, selectedSubject, minRating, priceRange, language, experienceLevel, availabilityFilters], () => {
  currentPage.value = 1;
});

// Synchroniser les filtres locaux avec le composable
const syncFilters = () => {
  teachersFilters.query = searchQuery.value;
  teachersFilters.subject = selectedSubject.value;
  teachersFilters.minRating = minRating.value;
  teachersFilters.priceRange = priceRange.value;
  teachersFilters.language = language.value;
  teachersFilters.experienceLevel = experienceLevel.value;
  teachersFilters.availability.weekdays = availabilityFilters.value.weekdays;
  teachersFilters.availability.weekends = availabilityFilters.value.weekends;
  teachersFilters.availability.evenings = availabilityFilters.value.evenings;
};

// Observer les changements dans les données du composable
watch(teachersData, (newTeachers) => {
  teachers.value = newTeachers;
});

// Observer les changements dans les filtres locaux
watch([searchQuery, selectedSubject, minRating, priceRange, language, experienceLevel, availabilityFilters], () => {
  syncFilters();
  currentPage.value = 1;
});

// Lifecycle
onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchSubjects(), fetchTeachers()]);
  
  // Mettre à jour les données locales avec celles du composable
  teachers.value = teachersData.value;
  subjects.value = teachersSubjects.value;
  loading.value = false;
});
</script>

<style scoped>
/* Line clamp for truncating text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom loader animation */
.teacher-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-loader div {
  width: 16px;
  height: 16px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: #6366F1; /* indigo-500 */
  animation: teacher-loader 1.5s infinite ease-in-out both;
}

.teacher-loader div:nth-child(1) {
  animation-delay: -0.3s;
}

.teacher-loader div:nth-child(2) {
  animation-delay: -0.15s;
}

@keyframes teacher-loader {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-pop-in {
  animation: pop-in 0.3s ease-out forwards;
}

/* Pulse animation for "Disponible maintenant" badge */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Blur effect for background decorations */
.blur-3xl {
  --tw-blur: blur(64px);
  filter: var(--tw-blur);
}
</style>