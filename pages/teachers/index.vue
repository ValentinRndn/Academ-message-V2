<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
    <!-- Background decorative elements -->
    <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
    
    <!-- Header section with animation -->
    <div class="relative animate-fade-in">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Teacher</h1>
      <p class="text-lg text-gray-600 mb-8">Connect with qualified experts in any subject to help you excel in your studies</p>
    </div>
    
    <!-- Search and Filters with animation -->
    <div class="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-100 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end gap-6 mb-6">
        <!-- Search -->
        <div class="flex-grow">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
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
              placeholder="Search by name, subject, or keyword..."
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
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <div class="relative">
            <select
              id="subject"
              v-model="selectedSubject"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">All Subjects</option>
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
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
          <div class="relative">
            <select
              id="rating"
              v-model="minRating"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
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
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div class="relative">
            <select
              id="price"
              v-model="priceRange"
              class="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Any Price</option>
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
          {{ showAdvancedFilters ? 'Hide advanced filters' : 'Show advanced filters' }}
        </button>
        
        <button 
          v-if="hasActiveFilters"
          @click="clearFilters" 
          class="ml-auto text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center focus:outline-none transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear all filters
        </button>
      </div>
      
      <!-- Advanced filters -->
      <div v-if="showAdvancedFilters" class="border-t border-gray-200 pt-4 mb-4 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Availability -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div class="space-y-2">
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.weekdays" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Weekdays</span>
              </label>
              <label class="inline-flex items-center ml-4 cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.weekends" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Weekends</span>
              </label>
              <label class="inline-flex items-center ml-4 cursor-pointer">
                <input type="checkbox" v-model="availabilityFilters.evenings" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-gray-700">Evenings</span>
              </label>
            </div>
          </div>
          
          <!-- Experience -->
          <div>
            <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <div class="relative">
              <select
                id="experience"
                v-model="experienceLevel"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Any Experience</option>
                <option value="beginner">1-3 years</option>
                <option value="intermediate">4-7 years</option>
                <option value="expert">8+ years</option>
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
            <label for="language" class="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <div class="relative">
              <select
                id="language"
                v-model="language"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Any Language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
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
          Search: {{ searchQuery }}
          <button @click="searchQuery = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="selectedSubject" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Subject: {{ getSubjectName(selectedSubject) }}
          <button @click="selectedSubject = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="minRating > 0" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Rating: {{ minRating }}+ Stars
          <button @click="minRating = 0" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="priceRange" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Price: {{ getPriceRangeLabel() }}
          <button @click="priceRange = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="experienceLevel" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Experience: {{ getExperienceLevelLabel() }}
          <button @click="experienceLevel = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="language" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Language: {{ language.charAt(0).toUpperCase() + language.slice(1) }}
          <button @click="language = ''" class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="hasAvailabilityFilters" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Availability: {{ getAvailabilityLabel() }}
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
        Found <span class="font-semibold text-gray-900">{{ filteredTeachers.length }}</span> teachers matching your criteria
      </p>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700">Sort by:</span>
        <select
          v-model="sortOption"
          class="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Highest Rating</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="experience">Most Experienced</option>
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
      <p class="mt-6 text-gray-500">Finding the best teachers for you...</p>
    </div>
    
    <!-- Empty results state -->
    <div v-else-if="filteredTeachers.length === 0" class="bg-white shadow-lg rounded-xl p-10 text-center max-w-xl mx-auto animate-fade-in-up">
      <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">No teachers found</h3>
      <p class="text-gray-600 mb-8">We couldn't find any teachers matching your current search criteria. Try adjusting your filters or starting a new search.</p>
      <button 
        @click="clearFilters" 
        class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Clear all filters
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
            Available Now
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
              <h3 class="text-sm font-medium text-gray-900 mb-2">Subjects</h3>
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
            
            <!-- Experience and other info -->
            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ getTeacherExperience(teacher) }} Experience
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
                  View Profile
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
              Available Now
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
                {{ getTeacherExperience(teacher) }} Experience
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
                View Profile
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
          <span class="sr-only">Previous</span>
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
          <span class="sr-only">Next</span>
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

const router = useRouter();

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
const clearFilters = () => {
  searchQuery.value = '';
  selectedSubject.value = '';
  minRating.value = 0;
  priceRange.value = '';
  language.value = '';
  experienceLevel.value = '';
  clearAvailabilityFilters();
  currentPage.value = 1;
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

const getExperienceLevelLabel = () => {
  if (experienceLevel.value === 'beginner') return '1-3 years';
  if (experienceLevel.value === 'intermediate') return '4-7 years';
  if (experienceLevel.value === 'expert') return '8+ years';
  return '';
};

const getAvailabilityLabel = () => {
  const labels = [];
  if (availabilityFilters.value.weekdays) labels.push('Weekdays');
  if (availabilityFilters.value.weekends) labels.push('Weekends');
  if (availabilityFilters.value.evenings) labels.push('Evenings');
  return labels.join(', ');
};

const getTeacherExperience = (teacher) => {
  return `${teacher.experience || 5}+ years`;
};

const getTeacherSessions = (teacher) => {
  return `${teacher.sessionsCompleted || (Math.floor(Math.random() * 50) + 10)}+`;
};

const getTeacherLanguage = (teacher) => {
  if (teacher.languages && teacher.languages.length > 0) {
    return teacher.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
  }
  return 'English';
};

const applyFilters = () => {
  console.log('Applying filters...');
  currentPage.value = 1;
};

const messageTeacher = (teacherId) => {
  router.push(`/messages?teacher=${teacherId}`);
};

const fetchSubjects = async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 800));
    
    subjects.value = [
      { id: 'math', name: 'Mathematics' },
      { id: 'phys', name: 'Physics' },
      { id: 'chem', name: 'Chemistry' },
      { id: 'bio', name: 'Biology' },
      { id: 'cs', name: 'Computer Science' },
      { id: 'eng', name: 'English' },
      { id: 'hist', name: 'History' },
      { id: 'geog', name: 'Geography' },
      { id: 'econ', name: 'Economics' },
      { id: 'psych', name: 'Psychology' },
      { id: 'art', name: 'Art' },
      { id: 'music', name: 'Music' }
    ];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    subjects.value = [];
  }
};

const fetchTeachers = async () => {
  loading.value = true;
  
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    teachers.value = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        bio: 'I am a dedicated mathematics teacher with over 10 years of experience. I specialize in calculus, algebra, and statistics. My approach to teaching is student-centered, focusing on building strong foundations and problem-solving skills.',
        subjects: [
          { id: 'math', name: 'Mathematics' },
          { id: 'calc', name: 'Calculus' },
          { id: 'alg', name: 'Algebra' }
        ],
        averageRating: 4.8,
        reviewCount: 32,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        hourlyRate: 50,
        isAvailableNow: true,
        experience: 10,
        languages: ['english', 'spanish'],
        sessionsCompleted: 124,
        availability: [
          { dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' },
          { dayOfWeek: 3, startTime: '09:00:00', endTime: '17:00:00' },
          { dayOfWeek: 5, startTime: '13:00:00', endTime: '18:00:00' }
        ]
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Physics teacher specializing in mechanics and electromagnetism. I have a PhD in Physics and have been teaching for 7 years. I believe in making complex concepts intuitive and relatable through real-world examples.',
        subjects: [
          { id: 'phys', name: 'Physics' },
          { id: 'mech', name: 'Mechanics' },
          { id: 'elec', name: 'Electromagnetism' }
        ],
        averageRating: 4.9,
        reviewCount: 27,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        hourlyRate: 55,
        isAvailableNow: false,
        experience: 7,
        languages: ['english', 'french'],
        sessionsCompleted: 89,
        availability: [
          { dayOfWeek: 2, startTime: '10:00:00', endTime: '18:00:00' },
          { dayOfWeek: 4, startTime: '10:00:00', endTime: '18:00:00' },
          { dayOfWeek: 6, startTime: '12:00:00', endTime: '16:00:00' }
        ]
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        bio: 'Computer Science teacher with expertise in programming, algorithms, and data structures. I have a background in software development and have been teaching for 5 years. I focus on practical skills that prepare students for real-world challenges.',
        subjects: [
          { id: 'cs', name: 'Computer Science' },
          { id: 'prog', name: 'Programming' },
          { id: 'algo', name: 'Algorithms' },
          { id: 'data', name: 'Data Structures' }
        ],
        averageRating: 4.7,
        reviewCount: 19,
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        hourlyRate: 60,
        isAvailableNow: true,
        experience: 5,
        languages: ['english', 'german'],
        sessionsCompleted: 67,
        availability: [
          { dayOfWeek: 1, startTime: '13:00:00', endTime: '20:00:00' },
          { dayOfWeek: 3, startTime: '13:00:00', endTime: '20:00:00' },
          { dayOfWeek: 5, startTime: '13:00:00', endTime: '20:00:00' }
        ]
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        bio: 'Chemistry teacher specializing in organic chemistry and biochemistry. I have a Masters in Chemistry and 8 years of teaching experience. My goal is to make chemistry accessible and interesting for all students.',
        subjects: [
          { id: 'chem', name: 'Chemistry' },
          { id: 'org', name: 'Organic Chemistry' },
          { id: 'bio', name: 'Biochemistry' }
        ],
        averageRating: 4.6,
        reviewCount: 24,
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        hourlyRate: 45,
        isAvailableNow: false,
        experience: 8,
        languages: ['english'],
        sessionsCompleted: 103,
        availability: [
          { dayOfWeek: 2, startTime: '09:00:00', endTime: '15:00:00' },
          { dayOfWeek: 4, startTime: '09:00:00', endTime: '15:00:00' },
          { dayOfWeek: 0, startTime: '10:00:00', endTime: '14:00:00' }
        ]
      },
      {
        id: '5',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@example.com',
        bio: 'English teacher with a focus on literature, writing, and grammar. I have a background in journalism and have been teaching for 12 years. I help students develop their critical thinking and communication skills through analyzing and creating texts.',
        subjects: [
          { id: 'eng', name: 'English' },
          { id: 'lit', name: 'Literature' },
          { id: 'writ', name: 'Writing' }
        ],
        averageRating: 4.5,
        reviewCount: 31,
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        hourlyRate: 40,
        isAvailableNow: true,
        experience: 12,
        languages: ['english', 'spanish'],
        sessionsCompleted: 156,
        availability: [
          { dayOfWeek: 1, startTime: '10:00:00', endTime: '16:00:00' },
          { dayOfWeek: 3, startTime: '10:00:00', endTime: '16:00:00' },
          { dayOfWeek: 5, startTime: '10:00:00', endTime: '16:00:00' }
        ]
      },
      {
        id: '6',
        firstName: 'Jennifer',
        lastName: 'Lee',
        email: 'jennifer.lee@example.com',
        bio: 'Biology teacher specializing in genetics, ecology, and human biology. I have a PhD in Biology and have been teaching for 6 years. I use interactive methods and visual aids to make complex biological concepts easier to understand.',
        subjects: [
          { id: 'bio', name: 'Biology' },
          { id: 'gen', name: 'Genetics' },
          { id: 'eco', name: 'Ecology' }
        ],
        averageRating: 4.9,
        reviewCount: 18,
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        hourlyRate: 55,
        isAvailableNow: false,
        experience: 6,
        languages: ['english', 'mandarin'],
        sessionsCompleted: 72,
        availability: [
          { dayOfWeek: 2, startTime: '13:00:00', endTime: '19:00:00' },
          { dayOfWeek: 4, startTime: '13:00:00', endTime: '19:00:00' },
          { dayOfWeek: 6, startTime: '10:00:00', endTime: '15:00:00' }
        ]
      },
      {
        id: '7',
        firstName: 'David',
        lastName: 'Taylor',
        email: 'david.taylor@example.com',
        bio: 'History teacher with expertise in world history, European history, and historical analysis. I have a Masters in History and have been teaching for 9 years. I help students understand historical contexts and develop critical thinking about historical events.',
        subjects: [
          { id: 'hist', name: 'History' },
          { id: 'world', name: 'World History' },
          { id: 'euro', name: 'European History' }
        ],
        averageRating: 4.7,
        reviewCount: 23,
        avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        hourlyRate: 45,
        isAvailableNow: true,
        experience: 9,
        languages: ['english', 'french'],
        sessionsCompleted: 112,
        availability: [
          { dayOfWeek: 1, startTime: '09:00:00', endTime: '15:00:00' },
          { dayOfWeek: 3, startTime: '09:00:00', endTime: '15:00:00' },
          { dayOfWeek: 5, startTime: '09:00:00', endTime: '15:00:00' }
        ]
      },
      {
        id: '8',
        firstName: 'Lisa',
        lastName: 'Miller',
        email: 'lisa.miller@example.com',
        bio: 'Economics teacher with a background in finance and business. I have a Masters in Economics and 7 years of teaching experience. I focus on making economic theories relevant through real-world applications and current events.',
        subjects: [
          { id: 'econ', name: 'Economics' },
          { id: 'fin', name: 'Finance' },
          { id: 'bus', name: 'Business Studies' }
        ],
        averageRating: 4.8,
        reviewCount: 21,
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        hourlyRate: 60,
        isAvailableNow: false,
        experience: 7,
        languages: ['english'],
        sessionsCompleted: 85,
        availability: [
          { dayOfWeek: 2, startTime: '10:00:00', endTime: '18:00:00' },
          { dayOfWeek: 4, startTime: '10:00:00', endTime: '18:00:00' },
          { dayOfWeek: 0, startTime: '12:00:00', endTime: '16:00:00' }
        ]
      },
      {
        id: '9',
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@example.com',
        bio: 'Geography teacher specializing in physical geography, human geography, and GIS. I have a PhD in Geography and have been teaching for 11 years. I use maps, data visualization, and field studies to bring geographical concepts to life.',
        subjects: [
          { id: 'geog', name: 'Geography' },
          { id: 'phys', name: 'Physical Geography' },
          { id: 'hum', name: 'Human Geography' }
        ],
        averageRating: 4.6,
        reviewCount: 19,
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        hourlyRate: 50,
        isAvailableNow: true,
        experience: 11,
        languages: ['english', 'german'],
        sessionsCompleted: 127,
        availability: [
          { dayOfWeek: 1, startTime: '12:00:00', endTime: '20:00:00' },
          { dayOfWeek: 3, startTime: '12:00:00', endTime: '20:00:00' },
          { dayOfWeek: 6, startTime: '09:00:00', endTime: '15:00:00' }
        ]
      },
      {
        id: '10',
        firstName: 'Michelle',
        lastName: 'Thomas',
        email: 'michelle.thomas@example.com',
        bio: 'Psychology teacher with expertise in cognitive psychology, developmental psychology, and research methods. I have a Masters in Psychology and have been teaching for 8 years. I help students understand human behavior through theory and practical examples.',
        subjects: [
          { id: 'psych', name: 'Psychology' },
          { id: 'cog', name: 'Cognitive Psychology' },
          { id: 'dev', name: 'Developmental Psychology' }
        ],
        averageRating: 4.9,
        reviewCount: 25,
        avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
        hourlyRate: 55,
        isAvailableNow: false,
        experience: 8,
        languages: ['english', 'french'],
        sessionsCompleted: 96,
        availability: [
          { dayOfWeek: 2, startTime: '09:00:00', endTime: '17:00:00' },
          { dayOfWeek: 4, startTime: '09:00:00', endTime: '17:00:00' },
          { dayOfWeek: 0, startTime: '10:00:00', endTime: '14:00:00' }
        ]
      },
      {
        id: '11',
        firstName: 'Richard',
        lastName: 'Clark',
        email: 'richard.clark@example.com',
        bio: 'Art teacher specializing in drawing, painting, and art history. I have a BFA in Fine Arts and have been teaching for a decade. I help students develop their artistic skills and express their creativity while understanding the context and theory behind art.',
        subjects: [
          { id: 'art', name: 'Art' },
          { id: 'draw', name: 'Drawing' },
          { id: 'paint', name: 'Painting' }
        ],
        averageRating: 4.7,
        reviewCount: 22,
        avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
        hourlyRate: 45,
        isAvailableNow: true,
        experience: 10,
        languages: ['english', 'italian'],
        sessionsCompleted: 118,
        availability: [
          { dayOfWeek: 2, startTime: '13:00:00', endTime: '19:00:00' },
          { dayOfWeek: 4, startTime: '13:00:00', endTime: '19:00:00' },
          { dayOfWeek: 6, startTime: '10:00:00', endTime: '16:00:00' }
        ]
      },
      {
        id: '12',
        firstName: 'Patricia',
        lastName: 'Walker',
        email: 'patricia.walker@example.com',
        bio: 'Music teacher with expertise in piano, music theory, and composition. I have a Masters in Music and have been teaching for 15 years. I help students develop their musical skills while fostering a deep appreciation for different musical genres and traditions.',
        subjects: [
          { id: 'music', name: 'Music' },
          { id: 'piano', name: 'Piano' },
          { id: 'theory', name: 'Music Theory' }
        ],
        averageRating: 4.8,
        reviewCount: 30,
        avatar: 'https://randomuser.me/api/portraits/women/76.jpg',
        hourlyRate: 50,
        isAvailableNow: false,
        experience: 15,
        languages: ['english', 'spanish'],
        sessionsCompleted: 172,
        availability: [
          { dayOfWeek: 1, startTime: '14:00:00', endTime: '20:00:00' },
          { dayOfWeek: 3, startTime: '14:00:00', endTime: '20:00:00' },
          { dayOfWeek: 5, startTime: '14:00:00', endTime: '20:00:00' }
        ]
      }
    ];
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

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchSubjects(), fetchTeachers()]);
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

/* Pulse animation for "Available Now" badge */
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