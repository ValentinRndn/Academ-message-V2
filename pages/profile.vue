<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-purple-100 opacity-30 blur-3xl"></div>
    
    <!-- Main Profile Card -->
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden mb-10 relative transform transition-all duration-300 hover:shadow-2xl">
      <!-- Profile header with gradient -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 h-40 flex items-end">
        <div class="container mx-auto px-8 pb-6 flex justify-between items-end relative z-10">
          <h1 class="text-2xl sm:text-3xl font-bold text-white animate-fade-in">My Profile</h1>
          <button 
            @click="isEditing = !isEditing" 
            class="px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            <span class="flex items-center">
              <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </span>
          </button>
        </div>
        
        <!-- Profile card decorative elements -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full border-8 border-white"></div>
          <div class="absolute top-20 left-20 w-20 h-20 rounded-full border-4 border-white"></div>
        </div>
      </div>
      
      <!-- Profile avatar section -->
      <div class="container mx-auto px-8 -mt-16">
        <div class="flex flex-col sm:flex-row sm:items-end">
          <div class="relative group animate-fade-in">
            <Avatar
              :avatar-url="profile.avatar"
              :alt="profile.firstName + ' ' + profile.lastName"
              size="2xl"
            />
            
            <div v-if="isEditing" class="absolute bottom-1 right-1">
              <button 
                class="bg-indigo-600 text-white rounded-full p-2 shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Change avatar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="mt-4 sm:mt-0 sm:ml-6 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <div class="flex items-center mt-1">
              <span v-if="profile.role === 'teacher'" class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Teacher
              </span>
              <span v-else class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student
              </span>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-gray-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ profile.institution || 'University' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile content -->
      <div class="container mx-auto px-8 py-10">
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-8 animate-fade-in">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-gray-50 p-5 rounded-lg transform transition hover:shadow-md">
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="mt-2 text-gray-900 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ profile.email }}
                </p>
              </div>
              <div class="bg-gray-50 p-5 rounded-lg transform transition hover:shadow-md">
                <p class="text-sm font-medium text-gray-500">Institution</p>
                <p class="mt-2 text-gray-900 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ profile.institution || 'Not specified' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Edit Profile Form -->
        <form v-else @submit.prevent="saveProfile" class="space-y-8 animate-fade-in">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div class="relative rounded-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    id="firstName" 
                    v-model="editedProfile.firstName" 
                    type="text" 
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div class="relative rounded-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    id="lastName" 
                    v-model="editedProfile.lastName" 
                    type="text" 
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div class="relative rounded-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    id="email" 
                    v-model="editedProfile.email" 
                    type="email" 
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label for="institution" class="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <div class="relative rounded-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input 
                    id="institution" 
                    v-model="editedProfile.institution" 
                    type="text" 
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Save Button -->
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Teacher-specific sections -->
    <div v-if="profile.role === 'teacher'" class="space-y-10">
      <!-- Availability Settings -->
      <div class="transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
        <TeacherAvailability :teacherId="'teacher-123'" class="bg-white shadow-lg rounded-2xl overflow-hidden animate-fade-in-up" />
      </div>
      
      <!-- Subjects -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden animate-fade-in-up transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Subjects
            </h2>
            <button 
              v-if="!isEditingSubjects"
              @click="isEditingSubjects = true"
              class="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Subjects
            </button>
          </div>
          
          <p class="text-gray-600 mb-6">
            Manage the subjects you teach. Students will be able to find you based on these subjects.
          </p>
          
          <div v-if="isEditingSubjects" class="animate-fade-in">
            <div class="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-lg min-h-[100px] mb-6 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
              <div 
                v-for="subject in teacherSubjects" 
                :key="subject"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 transition-all hover:bg-indigo-200"
              >
                {{ subject }}
                <button 
                  type="button"
                  @click="removeSubject(subject)"
                  class="ml-1.5 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="newSubject" 
                  @keydown.enter.prevent="addSubject"
                  type="text" 
                  placeholder="Add subject..." 
                  class="border-0 p-1 focus:ring-0 text-sm bg-transparent"
                />
                <button 
                  type="button"
                  @click="addSubject"
                  class="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="isEditingSubjects = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                @click="saveSubjects"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Subjects
              </button>
            </div>
          </div>
          
          <div v-else>
            <div v-if="teacherSubjects.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500 mb-4">No subjects added yet</p>
              <button 
                @click="isEditingSubjects = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Subjects
              </button>
            </div>
            
            <div v-else class="flex flex-wrap gap-3 mb-6">
              <span 
                v-for="subject in teacherSubjects" 
                :key="subject"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-default"
              >
                {{ subject }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats overview for teachers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
        <div class="bg-white p-6 rounded-2xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div class="bg-indigo-100 p-3 rounded-xl mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Students</p>
            <p class="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div class="bg-green-100 p-3 rounded-xl mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Teaching Hours</p>
            <p class="text-2xl font-bold text-gray-900">32</p>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
          <div class="bg-purple-100 p-3 rounded-xl mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Average Rating</p>
            <p class="text-2xl font-bold text-gray-900">4.8</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Student-specific sections -->
    <div v-if="profile.role === 'student'" class="space-y-10">
      <!-- Upcoming Sessions -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden animate-fade-in-up transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming Sessions
            </h2>
          </div>
          
          <div class="text-center py-12 bg-gray-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-gray-500 mb-6">No upcoming sessions</p>
            <div class="mt-4">
              <NuxtLink 
                to="/teachers" 
                class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find a Teacher
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Learning Progress -->
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden animate-fade-in-up transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
        <div class="p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Learning Progress
          </h2>
          
          <div class="bg-gray-50 rounded-xl p-6">
            <p class="text-gray-500 mb-6">Start tracking your learning progress by booking sessions with teachers</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div class="text-center">
                  <div class="text-3xl font-bold text-indigo-600">0</div>
                  <div class="text-sm text-gray-500">Completed Sessions</div>
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div class="text-center">
                  <div class="text-3xl font-bold text-indigo-600">0</div>
                  <div class="text-sm text-gray-500">Hours of Learning</div>
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div class="text-center">
                  <div class="text-3xl font-bold text-indigo-600">0</div>
                  <div class="text-sm text-gray-500">Subjects Explored</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import TeacherAvailability from '~/components/TeacherAvailability.vue';

// Mock profile data
const profile = reactive({
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@university.edu',
  role: 'teacher',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  institution: 'University of Technology'
});

// State
const isEditing = ref(false);
const editedProfile = reactive({ ...profile });
const isEditingSubjects = ref(false);
const teacherSubjects = ref(['Mathematics', 'Computer Science', 'Artificial Intelligence']);
const newSubject = ref('');

// Methods
const saveProfile = () => {
  // In a real app, you would call your API to update the profile
  Object.assign(profile, editedProfile);
  isEditing.value = false;
  console.log('Profile updated successfully');
};

const addSubject = () => {
  if (newSubject.value.trim()) {
    if (!teacherSubjects.value.includes(newSubject.value.trim())) {
      teacherSubjects.value.push(newSubject.value.trim());
    }
    newSubject.value = '';
  }
};

const removeSubject = (subject) => {
  teacherSubjects.value = teacherSubjects.value.filter(s => s !== subject);
};

const saveSubjects = async () => {
  // In a real app, this would be an API call
  console.log('Saving subjects:', teacherSubjects.value);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  isEditingSubjects.value = false;
  console.log('Subjects saved successfully');
};

// Lifecycle
onMounted(() => {
  // In a real app, you would fetch the profile data from the API
  console.log('Profile component mounted');
});
</script>

<style scoped>
/* Animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes float-slow {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-15px) translateX(15px); }
  100% { transform: translateY(0px) translateX(0px); }
}

@keyframes float-reverse {
  0% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
  100% { transform: translateY(0px); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-reverse {
  animation: float-reverse 7s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

/* Card elevation effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hover\:translate-y-\[\-2px\]:hover {
  transform: translateY(-2px);
}

.hover\:translate-y-\[\-4px\]:hover {
  transform: translateY(-4px);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Transition utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

/* Blur effect for background decorations */
.blur-3xl {
  --tw-blur: blur(64px);
  filter: var(--tw-blur);
}
</style>