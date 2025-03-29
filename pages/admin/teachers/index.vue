<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Manage Teachers</h1>
      <button 
        @click="showAddTeacherModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Teacher
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
    
    <!-- Teacher list -->
    <div v-else-if="teachers.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
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
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img 
                    :src="teacher.avatar || 'https://ui-avatars.com/api/?name=' + teacher.firstName + '+' + teacher.lastName" 
                    :alt="`${teacher.firstName} ${teacher.lastName}`"
                    class="h-10 w-10 rounded-full"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
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
                  v-for="subject in teacher.subjects" 
                  :key="subject.id"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ subject.name }}
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
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
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
    
    <!-- Empty state -->
    <div v-else class="bg-white p-8 rounded-lg shadow-md text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No teachers found</h3>
      <p class="mt-2 text-gray-600">Get started by adding your first teacher</p>
      <div class="mt-6">
        <button 
          @click="showAddTeacherModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Teacher
        </button>
      </div>
    </div>
    
    <!-- Add/Edit Teacher Modal -->
    <div v-if="showAddTeacherModal || showEditTeacherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            {{ showEditTeacherModal ? 'Edit Teacher' : 'Add New Teacher' }}
          </h3>
          
          <form @submit.prevent="showEditTeacherModal ? updateTeacher() : addTeacher()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  id="firstName" 
                  v-model="teacherForm.firstName" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  id="lastName" 
                  v-model="teacherForm.lastName" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email" 
                  v-model="teacherForm.email" 
                  type="email" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div v-if="!showEditTeacherModal">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  id="password" 
                  v-model="teacherForm.password" 
                  type="password" 
                  required 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div class="md:col-span-2">
                <label for="subjects" class="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[80px]">
                  <div 
                    v-for="subject in teacherForm.subjects" 
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
                      @keydown.enter.prevent="addSubjectToForm"
                      type="text" 
                      placeholder="Add subject..." 
                      class="border-0 p-0 focus:ring-0 text-sm"
                    />
                    <button 
                      type="button"
                      @click="addSubjectToForm"
                      class="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea 
                  id="bio" 
                  v-model="teacherForm.bio" 
                  rows="4" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Teacher's biography, experience, and specialties..."
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="cancelTeacherModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                {{ showEditTeacherModal ? 'Update Teacher' : 'Add Teacher' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  subjects: []
})
const newSubject = ref('')
const editingTeacherId = ref(null)

// Methods
const fetchTeachers = async () => {
  try {
    loading.value = true
    // In a real app, this would be an API call
    const response = await fetch('/api/teachers')
    teachers.value = await response.json()
  } catch (error) {
    console.error('Error fetching teachers:', error)
  } finally {
    loading.value = false
  }
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
    subjects: teacher.subjects.map(s => s.name)
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
    subjects: []
  }
  newSubject.value = ''
  editingTeacherId.value = null
}

const addTeacher = async () => {
  try {
    // In a real app, this would be an API call
    const response = await fetch('/api/admin/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherForm.value),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add teacher')
    }
    
    // Add the new teacher to the list
    const newTeacher = await response.json()
    teachers.value.push(newTeacher)
    
    // Close the modal and reset the form
    showAddTeacherModal.value = false
    resetTeacherForm()
  } catch (error) {
    console.error('Error adding teacher:', error)
    alert('Failed to add teacher. Please try again.')
  }
}

const updateTeacher = async () => {
  try {
    // In a real app, this would be an API call
    const response = await fetch(`/api/admin/teachers/${editingTeacherId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherForm.value),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update teacher')
    }
    
    // Update the teacher in the list
    const updatedTeacher = await response.json()
    const index = teachers.value.findIndex(t => t.id === updatedTeacher.id)
    if (index !== -1) {
      teachers.value[index] = updatedTeacher
    }
    
    // Close the modal and reset the form
    showEditTeacherModal.value = false
    resetTeacherForm()
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
