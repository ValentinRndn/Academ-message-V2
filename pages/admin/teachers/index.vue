<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header section with animation -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 animate-fade-in">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Teachers</h1>
        <p class="text-gray-600">Add, edit, and manage your platform's academic experts</p>
      </div>
      <button 
        @click="showAddTeacherModal = true"
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Ajouter un enseignant
      </button>
    </div>
    
    <!-- Stats overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center transform transition duration-300 hover:shadow-lg hover:translate-y-[-4px]">
        <div class="bg-indigo-100 p-3 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Total Teachers</div>
          <div class="text-2xl font-bold text-gray-900">{{ teachers.length }}</div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center transform transition duration-300 hover:shadow-lg hover:translate-y-[-4px]">
        <div class="bg-green-100 p-3 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Active Subjects</div>
          <div class="text-2xl font-bold text-gray-900">
            {{ getAllSubjects().length }}
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center transform transition duration-300 hover:shadow-lg hover:translate-y-[-4px]">
        <div class="bg-purple-100 p-3 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <div class="text-sm text-gray-500 font-medium">Avg. Rating</div>
          <div class="text-2xl font-bold text-gray-900">{{ getAverageRating() }}</div>
        </div>
      </div>
    </div>
    
    <!-- Search and filter bar -->
    <div class="mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search teachers by name, email, or subject..."
                v-model="searchQuery"
                class="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div class="flex-shrink-0 flex items-center gap-4">
            <div class="relative inline-block text-left">
              <select
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            
            <div class="relative inline-block text-left">
              <select
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="subjects">Sort by Subjects</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading state with custom animation -->
    <div v-if="loading" class="flex justify-center py-20 animate-fade-in-up" style="animation-delay: 0.3s;">
      <div class="relative">
        <div class="teacher-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p class="text-gray-500 mt-6 text-center">Loading teachers...</p>
      </div>
    </div>
    
    <!-- Teacher list with card view -->
    <div v-else-if="filteredTeachers.length > 0" class="animate-fade-in-up" style="animation-delay: 0.3s;">
      <!-- Toggle view -->
      <div class="flex justify-end mb-4">
        <div class="inline-flex rounded-lg overflow-hidden bg-gray-100 p-1">
          <button 
            @click="viewMode = 'grid'" 
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'grid' 
                ? 'bg-white text-indigo-600 shadow-sm rounded-md'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'table'" 
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'table' 
                ? 'bg-white text-indigo-600 shadow-sm rounded-md'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Grid view -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="teacher in filteredTeachers" 
          :key="teacher.id"
          class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition duration-300 hover:shadow-xl hover:translate-y-[-4px]"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="relative">
                <img 
                  :src="teacher.avatar || 'https://ui-avatars.com/api/?name=' + teacher.firstName + '+' + teacher.lastName + '&background=6366F1&color=fff'" 
                  :alt="`${teacher.firstName} ${teacher.lastName}`"
                  class="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div 
                  class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white"
                  :class="teacher.status === 'inactive' ? 'bg-gray-300' : 'bg-green-400'"
                ></div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-bold text-gray-900 flex items-center">
                  {{ teacher.firstName }} {{ teacher.lastName }}
                </h3>
                <p class="text-sm text-gray-600">{{ teacher.email }}</p>
              </div>
            </div>
            
            <div class="mt-4">
              <div class="flex items-center mb-2">
                <div class="text-sm font-medium text-gray-500">Rating:</div>
                <div class="ml-auto flex items-center">
                  <div class="flex">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-5 w-5 text-yellow-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-1 text-sm font-medium text-gray-900">
                    {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'N/A' }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center mb-3">
                <div class="text-sm font-medium text-gray-500">Status:</div>
                <div class="ml-auto">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      teacher.status === 'inactive' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ teacher.status === 'inactive' ? 'Inactive' : 'Active' }}
                  </span>
                </div>
              </div>
              
              <div class="mt-3">
                <div class="text-sm font-medium text-gray-500 mb-2">Subjects:</div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="subject in teacher.subjects.slice(0, 3)" 
                    :key="subject.id"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {{ subject.name }}
                  </span>
                  <span 
                    v-if="teacher.subjects.length > 3"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    +{{ teacher.subjects.length - 3 }} more
                  </span>
                  <span v-if="teacher.subjects.length === 0" class="text-sm text-gray-500">
                    None
                  </span>
                </div>
              </div>
              
              <div class="mt-5 flex space-x-2 justify-end">
                <button 
                  @click="viewTeacher(teacher.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button 
                  @click="editTeacher(teacher)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table view -->
      <div v-else class="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 relative">
                      <Avatar
                        :avatar-url="teacher.avatar"
                        :alt="`${teacher.firstName} ${teacher.lastName}`"
                        size="md"
                        :online="teacher.status !== 'inactive'"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900">
                        {{ teacher.firstName }} {{ teacher.lastName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ teacher.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="subject in teacher.subjects.slice(0, 2)" 
                      :key="subject.id"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ subject.name }}
                    </span>
                    <span 
                      v-if="teacher.subjects.length > 2"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      +{{ teacher.subjects.length - 2 }} more
                    </span>
                    <span v-if="teacher.subjects.length === 0" class="text-sm text-gray-500">
                      None
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 text-yellow-400" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-1 text-sm text-gray-900">
                      {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'N/A' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      teacher.status === 'inactive' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ teacher.status === 'inactive' ? 'Inactive' : 'Active' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="viewTeacher(teacher.id)"
                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <button 
                    @click="editTeacher(teacher)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ pagination.startItem }}</span> to <span class="font-medium">{{ pagination.endItem }}</span> of <span class="font-medium">{{ filteredTeachers.length }}</span> teachers
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="pagination.currentPage === 1"
            :class="[
              'inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium',
              pagination.currentPage === 1
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>
          <button 
            @click="nextPage" 
            :disabled="pagination.currentPage === pagination.totalPages"
            :class="[
              'inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium',
              pagination.currentPage === pagination.totalPages
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors'
            ]"
          >
            Suivant
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty state with animation -->
    <div v-else-if="!loading" class="bg-white p-10 rounded-xl shadow-md text-center animate-fade-in-up" style="animation-delay: 0.3s;">
      <div class="bg-indigo-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun enseignant trouvé</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        {{ searchQuery ? 'Aucun enseignant ne correspond à vos critères de recherche. Essayez d\'autres mots-clés ou effacez les filtres.' : 'Commencez par ajouter votre premier enseignant pour constituer votre équipe académique.' }}
      </p>
      <div class="flex justify-center">
        <button 
          v-if="searchQuery"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Effacer les filtres
        </button>
        <button 
          @click="showAddTeacherModal = true"
          class="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un enseignant
        </button>
      </div>
    </div>
    
    <!-- Add/Edit Teacher Modal with animations -->
    <div v-if="showAddTeacherModal || showEditTeacherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-modal-in">
        <div class="relative">
          <!-- Modal header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-xl">
            <h3 class="text-lg font-bold text-white">
              {{ showEditTeacherModal ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant' }}
            </h3>
            <button 
              @click="cancelTeacherModal"
              class="absolute top-4 right-4 text-white opacity-70 hover:opacity-100 focus:outline-none transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal body -->
          <div class="p-6">
            <form @submit.prevent="showEditTeacherModal ? updateTeacher() : addTeacher()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="animate-fade-in" style="animation-delay: 100ms;">
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div class="relative rounded-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      id="firstName" 
                      v-model="teacherForm.firstName" 
                      type="text" 
                      required 
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Entrez le prénom"
                    />
                  </div>
                </div>
                
                <div class="animate-fade-in" style="animation-delay: 200ms;">
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <div class="relative rounded-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      id="lastName" 
                      v-model="teacherForm.lastName" 
                      type="text" 
                      required 
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Entrez le nom"
                    />
                  </div>
                </div>
                
                <div class="animate-fade-in" style="animation-delay: 300ms;">
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
                  <div class="relative rounded-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      id="email" 
                      v-model="teacherForm.email" 
                      type="email" 
                      required 
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="teacher@example.com"
                    />
                  </div>
                </div>
                
                <div v-if="!showEditTeacherModal" class="animate-fade-in" style="animation-delay: 400ms;">
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div class="relative rounded-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <input 
                      id="password" 
                      v-model="teacherForm.password" 
                      type="password" 
                      required 
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                </div>
                
                <div v-if="showEditTeacherModal" class="animate-fade-in" style="animation-delay: 400ms;">
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <div class="relative rounded-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select 
                      id="status" 
                      v-model="teacherForm.status" 
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>
                
                <div class="md:col-span-2 animate-fade-in" style="animation-delay: 500ms;">
                  <label for="subjects" class="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                  <div class="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg min-h-[100px] bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                    <div 
                      v-for="subject in teacherForm.subjects" 
                      :key="subject"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 animate-pop-in"
                    >
                      {{ subject }}
                      <button 
                        type="button"
                        @click="removeSubject(subject)"
                        class="ml-1.5 text-indigo-500 hover:text-indigo-700 focus:outline-none transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        v-model="newSubject" 
                        @keydown.enter.prevent="addSubjectToForm"
                        type="text" 
                        placeholder="Ajouter une matière..." 
                        class="border-0 p-1 focus:ring-0 text-sm bg-transparent"
                      />
                      <button 
                        type="button"
                        @click="addSubjectToForm"
                        class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Appuyez sur Entrée ou cliquez sur l'icône + pour ajouter une matière.
                  </p>
                </div>
                
                <div class="md:col-span-2 animate-fade-in" style="animation-delay: 600ms;">
                  <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                  <textarea 
                    id="bio" 
                    v-model="teacherForm.bio" 
                    rows="4" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Biographie, expérience et spécialités de l'enseignant..."
                  ></textarea>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 animate-fade-in" style="animation-delay: 700ms;">
                <button 
                  type="button"
                  @click="cancelTeacherModal"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ showEditTeacherModal ? 'Mettre à jour l\'enseignant' : 'Ajouter un enseignant' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const teachers = ref([])
const loading = ref(true)
const showAddTeacherModal = ref(false)
const showEditTeacherModal = ref(false)
const teacherForm = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  bio: '',
  subjects: [],
  status: 'active'
})
const newSubject = ref('')
const editingTeacherId = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('name')
const viewMode = ref('grid') // 'grid' or 'table'

// Pagination
const pagination = reactive({
  currentPage: 1,
  itemsPerPage: 9,
  totalPages: 1,
  startItem: 1,
  endItem: 1
})

// Computed
const filteredTeachers = computed(() => {
  // First apply filters
  let result = [...teachers.value]
  
  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(teacher => teacher.status === statusFilter.value)
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase()
      const email = teacher.email.toLowerCase()
      const subjects = teacher.subjects.map(s => s.name.toLowerCase()).join(' ')
      return fullName.includes(query) || email.includes(query) || subjects.includes(query)
    })
  }
  
  // Sort
  if (sortBy.value === 'name') {
    result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => {
      if (!a.averageRating) return 1
      if (!b.averageRating) return -1
      return b.averageRating - a.averageRating
    })
  } else if (sortBy.value === 'subjects') {
    result.sort((a, b) => b.subjects.length - a.subjects.length)
  }
  
  // Update pagination
  pagination.totalPages = Math.ceil(result.length / pagination.itemsPerPage)
  
  // Apply pagination
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage
  const end = start + pagination.itemsPerPage
  
  pagination.startItem = result.length > 0 ? start + 1 : 0
  pagination.endItem = Math.min(end, result.length)
  
  return result.slice(start, end)
})

// Methods
const fetchTeachers = async () => {
  try {
    loading.value = true
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1200)) // Simulate API delay
    
    // Mock data
    teachers.value = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@university.edu',
        bio: 'Mathematics professor with 10 years of experience teaching calculus and differential equations.',
        subjects: [
          { id: '1', name: 'Calculus' },
          { id: '2', name: 'Differential Equations' },
          { id: '3', name: 'Linear Algebra' }
        ],
        averageRating: 4.8,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 'active'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@university.edu',
        bio: 'Computer Science professor specializing in algorithms and data structures.',
        subjects: [
          { id: '4', name: 'Algorithms' },
          { id: '5', name: 'Data Structures' },
          { id: '6', name: 'Programming' }
        ],
        averageRating: 4.5,
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        status: 'active'
      },
      {
        id: '3',
        firstName: 'Robert',
        lastName: 'Williams',
        email: 'robert.williams@university.edu',
        bio: 'Physics professor with expertise in quantum mechanics and optics.',
        subjects: [
          { id: '7', name: 'Quantum Mechanics' },
          { id: '8', name: 'Optics' },
          { id: '9', name: 'Thermodynamics' }
        ],
        averageRating: 4.6,
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        status: 'inactive'
      },
      {
        id: '4',
        firstName: 'Emma',
        lastName: 'Brown',
        email: 'emma.brown@university.edu',
        bio: 'Chemistry professor specializing in organic chemistry and biochemistry.',
        subjects: [
          { id: '10', name: 'Organic Chemistry' },
          { id: '11', name: 'Biochemistry' }
        ],
        averageRating: 4.3,
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        status: 'active'
      },
      {
        id: '5',
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@university.edu',
        bio: 'Biology professor with research focus on genetics and molecular biology.',
        subjects: [
          { id: '12', name: 'Genetics' },
          { id: '13', name: 'Molecular Biology' },
          { id: '14', name: 'Cell Biology' }
        ],
        averageRating: 4.9,
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        status: 'active'
      }
    ]
  } catch (error) {
    console.error('Error fetching teachers:', error)
  } finally {
    loading.value = false
  }
}

const getAllSubjects = () => {
  const allSubjects = new Set()
  teachers.value.forEach(teacher => {
    teacher.subjects.forEach(subject => {
      allSubjects.add(subject.name)
    })
  })
  return Array.from(allSubjects)
}

const getAverageRating = () => {
  const totalTeachers = teachers.value.length
  if (totalTeachers === 0) return 'N/A'
  
  const sum = teachers.value.reduce((acc, teacher) => {
    return acc + (teacher.averageRating || 0)
  }, 0)
  
  return (sum / totalTeachers).toFixed(1)
}

const viewTeacher = (id) => {
  router.push(`/teachers/${id}`)
}

const editTeacher = (teacher) => {
  editingTeacherId.value = teacher.id
  teacherForm.value = {
    id: teacher.id,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    bio: teacher.bio || '',
    subjects: teacher.subjects.map(s => s.name),
    status: teacher.status || 'active'
  }
  showEditTeacherModal.value = true
}

const addSubjectToForm = () => {
  if (newSubject.value.trim()) {
    if (!teacherForm.value.subjects.includes(newSubject.value.trim())) {
      teacherForm.value.subjects.push(newSubject.value.trim())
    }
    newSubject.value = ''
  }
}

const removeSubject = (subject) => {
  teacherForm.value.subjects = teacherForm.value.subjects.filter(s => s !== subject)
}

const cancelTeacherModal = () => {
  showAddTeacherModal.value = false
  showEditTeacherModal.value = false
  resetTeacherForm()
}

const resetTeacherForm = () => {
  teacherForm.value = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    subjects: [],
    status: 'active'
  }
  newSubject.value = ''
  editingTeacherId.value = null
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  sortBy.value = 'name'
  pagination.currentPage = 1
}

const nextPage = () => {
  if (pagination.currentPage < pagination.totalPages) {
    pagination.currentPage++
  }
}

const prevPage = () => {
  if (pagination.currentPage > 1) {
    pagination.currentPage--
  }
}

const addTeacher = async () => {
  try {
    // In a real app, this would be an API call
    // For now, let's simulate it
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create a new teacher object
    const newTeacher = {
      id: String(teachers.value.length + 1),
      firstName: teacherForm.value.firstName,
      lastName: teacherForm.value.lastName,
      email: teacherForm.value.email,
      bio: teacherForm.value.bio,
      subjects: teacherForm.value.subjects.map((name, index) => ({ id: `new-${index}`, name })),
      averageRating: null,
      avatar: `https://ui-avatars.com/api/?name=${teacherForm.value.firstName}+${teacherForm.value.lastName}&background=6366F1&color=fff`,
      status: 'active'
    }
    
    // Add the new teacher to the list
    teachers.value.push(newTeacher)
    
    // Close the modal and reset the form
    showAddTeacherModal.value = false
    resetTeacherForm()
    
    // Show success message (in a real app, you might use a toast or notification system)
    alert('Teacher added successfully!')
  } catch (error) {
    console.error('Error adding teacher:', error)
    alert('Failed to add teacher. Please try again.')
  }
}

const updateTeacher = async () => {
  try {
    // In a real app, this would be an API call
    // For now, let's simulate it
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find the teacher in the list
    const index = teachers.value.findIndex(t => t.id === editingTeacherId.value)
    if (index === -1) {
      throw new Error('Teacher not found')
    }
    
    // Update the teacher
    teachers.value[index] = {
      ...teachers.value[index],
      firstName: teacherForm.value.firstName,
      lastName: teacherForm.value.lastName,
      email: teacherForm.value.email,
      bio: teacherForm.value.bio,
      subjects: teacherForm.value.subjects.map((name, idx) => ({ id: `${teachers.value[index].id}-${idx}`, name })),
      status: teacherForm.value.status
    }
    
    // Close the modal and reset the form
    showEditTeacherModal.value = false
    resetTeacherForm()
    
    // Show success message
    alert('Teacher updated successfully!')
  } catch (error) {
    console.error('Error updating teacher:', error)
    alert('Failed to update teacher. Please try again.')
  }
}

// Lifecycle
onMounted(async () => {
  await fetchTeachers()
})
</script>

<style scoped>
/* Modal animations */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out forwards;
}

/* Fade in animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
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

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Pop in animation for tags */
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

.animate-pop-in {
  animation: pop-in 0.3s ease-out forwards;
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

/* Hover transform effects */
.hover\:translate-y-\[-4px\]:hover {
  transform: translateY(-4px);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>