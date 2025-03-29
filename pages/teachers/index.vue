<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Find a Teacher</h1>
    
    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
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
              placeholder="Search by name or subject"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <!-- Subject Filter -->
        <div class="w-full md:w-64">
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            id="subject"
            v-model="selectedSubject"
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </div>
        
        <!-- Rating Filter -->
        <div class="w-full md:w-64">
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
          <select
            id="rating"
            v-model="minRating"
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="0">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>
      
      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
        <div v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Search: {{ searchQuery }}
          <button @click="searchQuery = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="selectedSubject" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Subject: {{ getSubjectName(selectedSubject) }}
          <button @click="selectedSubject = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="minRating > 0" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {{ minRating }}+ Stars
          <button @click="minRating = 0" class="ml-1 text-indigo-600 hover:text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button @click="clearFilters" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Clear all filters
        </button>
      </div>
    </div>
    
    <!-- Results -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="filteredTeachers.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No teachers found</h3>
      <p class="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
      <div class="mt-6">
        <button @click="clearFilters" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
          Clear all filters
        </button>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="teacher in filteredTeachers" 
        :key="teacher.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center">
            <img 
              :src="teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
              :alt="`${teacher.firstName} ${teacher.lastName}`" 
              class="h-16 w-16 rounded-full object-cover"
            />
            <div class="ml-4">
              <h2 class="text-lg font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</h2>
              <div class="flex items-center mt-1">
                <div class="flex items-center">
                  <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-1 text-sm text-gray-600">
                  {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'No ratings' }} 
                  {{ teacher.reviewCount ? `(${teacher.reviewCount} reviews)` : '' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-gray-600 line-clamp-3">{{ teacher.bio || 'No bio available' }}</p>
          </div>
          
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-900">Subjects</h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span 
                v-for="subject in teacher.subjects" 
                :key="subject.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ subject.name }}
              </span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-between items-center">
            <span class="text-sm font-medium text-gray-900">$50/hour</span>
            <NuxtLink 
              :to="`/teachers/${teacher.id}`" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// State
const searchQuery = ref('');
const selectedSubject = ref('');
const minRating = ref(0);
const loading = ref(true);
const teachers = ref([]);
const subjects = ref([]);

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedSubject.value || minRating.value > 0;
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
  
  return result;
});

// Methods
const clearFilters = () => {
  searchQuery.value = '';
  selectedSubject.value = '';
  minRating.value = 0;
};

const getSubjectName = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId);
  return subject ? subject.name : '';
};

const fetchSubjects = async () => {
  try {
    const response = await fetch('/api/subjects');
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    subjects.value = await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    subjects.value = [];
  }
};

const fetchTeachers = async () => {
  loading.value = true;
  
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }
    if (selectedSubject.value) {
      params.append('subject', selectedSubject.value);
    }
    
    // Fetch teachers from API
    const response = await fetch(`/api/teachers?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    
    teachers.value = await response.json();
  } catch (error) {
    console.error('Error fetching teachers:', error);
    teachers.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch for filter changes to refetch data
watch([searchQuery, selectedSubject], () => {
  fetchTeachers();
});

// Lifecycle
onMounted(async () => {
  await fetchSubjects();
  await fetchTeachers();
});
</script>

<style>
/* Add any component-specific styles here */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
