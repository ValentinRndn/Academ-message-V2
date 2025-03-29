<template>
  <div class="max-w-5xl mx-auto">
    <!-- Main Profile Card -->
    <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
      <!-- Profile header -->
      <div class="bg-indigo-600 h-32 flex items-end">
        <div class="container mx-auto px-6 pb-4 flex justify-between items-end">
          <h1 class="text-2xl font-bold text-white">My Profile</h1>
          <button 
            @click="isEditing = !isEditing" 
            class="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition-colors"
          >
            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
      </div>
      
      <!-- Profile avatar -->
      <div class="container mx-auto px-6 -mt-12">
        <div class="flex items-end">
          <div class="relative">
            <img 
              :src="profile.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'" 
              alt="Profile avatar" 
              class="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div v-if="isEditing" class="absolute bottom-0 right-0">
              <button 
                class="bg-indigo-600 text-white rounded-full p-1 shadow-md hover:bg-indigo-700"
                title="Change avatar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="ml-4">
            <h2 class="text-xl font-bold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="text-gray-600">{{ profile.role }} at {{ profile.institution || 'University' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Profile content -->
      <div class="container mx-auto px-6 py-8">
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="mt-1 text-gray-900">{{ profile.email }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Role</p>
                <p class="mt-1 text-gray-900">{{ profile.role }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Edit Profile Form -->
        <form v-else @submit.prevent="saveProfile" class="space-y-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  id="firstName" 
                  v-model="editedProfile.firstName" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  id="lastName" 
                  v-model="editedProfile.lastName" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email" 
                  v-model="editedProfile.email" 
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <!-- Save Button -->
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Teacher-specific sections -->
    <div v-if="profile.role === 'teacher'">
      <!-- Availability Settings -->
      <TeacherAvailability :teacherId="'teacher-123'" class="mb-8" />
      
      <!-- Subjects -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
          <p class="text-gray-600 mb-6">
            Manage the subjects you teach. Students will be able to find you based on these subjects.
          </p>
          
          <div v-if="isEditingSubjects">
            <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[80px] mb-4">
              <div 
                v-for="subject in teacherSubjects" 
                :key="subject"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ subject }}
                <button 
                  type="button"
                  @click="removeSubject(subject)"
                  class="ml-1 text-indigo-500 hover:text-indigo-700"
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
                  class="border-0 p-0 focus:ring-0 text-sm"
                />
                <button 
                  type="button"
                  @click="addSubject"
                  class="ml-1 text-indigo-600 hover:text-indigo-800"
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
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                @click="saveSubjects"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Save Subjects
              </button>
            </div>
          </div>
          
          <div v-else>
            <div v-if="teacherSubjects.length === 0" class="text-gray-500 italic mb-4">
              No subjects added yet
            </div>
            
            <div v-else class="flex flex-wrap gap-2 mb-6">
              <span 
                v-for="subject in teacherSubjects" 
                :key="subject"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ subject }}
              </span>
            </div>
            
            <button 
              @click="isEditingSubjects = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Subjects
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Student-specific sections -->
    <div v-if="profile.role === 'student'">
      <!-- Upcoming Sessions -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          
          <div class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-gray-500">No upcoming sessions</p>
            <div class="mt-4">
              <NuxtLink 
                to="/teachers" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Find a Teacher
              </NuxtLink>
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
