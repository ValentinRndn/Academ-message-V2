<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header avec navigation -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button 
            @click="goBack"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Student Details</h1>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Loading details...</p>
      </div>

      <div v-else-if="!student" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-2 text-gray-500">Student not found</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Informations principales -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-6">
              <!-- Avatar -->
              <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                <span class="text-purple-600 font-semibold text-2xl">
                  {{ student.firstName.charAt(0) }}{{ student.lastName.charAt(0) }}
                </span>
              </div>

              <!-- Informations de base -->
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ student.firstName }} {{ student.lastName }}
                  </h2>
                  <span 
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded-full',
                      getStatusClass(student.status)
                    ]"
                  >
                    {{ getStatusText(student.status) }}
                  </span>
                </div>
                
                <div class="space-y-1 text-gray-600">
                  <p><strong>Email:</strong> {{ student.email }}</p>
                  <p><strong>Phone:</strong> {{ student.phone || 'Not provided' }}</p>
                  <p><strong>Subjects:</strong> {{ student.subjects.join(', ') }}</p>
                  <p><strong>Student since:</strong> {{ formatDate(student.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Actions rapides -->
            <div class="flex items-center space-x-3">
              <button 
                @click="sendMessage"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Message</span>
                </div>
              </button>
              
              <button 
                @click="scheduleCourse"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Schedule</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ student.totalCourses }}</p>
              <p class="text-sm text-gray-500">Total courses</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ student.totalHours }}h</p>
              <p class="text-sm text-gray-500">Total hours</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ student.averageRating }}/5</p>
              <p class="text-sm text-gray-500">Average rating</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ student.recentProgress }}%</p>
              <p class="text-sm text-gray-500">Recent progress</p>
            </div>
          </div>
        </div>

        <!-- Onglets -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Navigation des onglets -->
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Contenu des onglets -->
          <div class="p-6">
            <!-- Onglet Cours -->
            <div v-if="activeTab === 'courses'">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Course History</h3>
              
              <div v-if="courses.length === 0" class="text-center py-8">
                <p class="text-gray-500">No courses found</p>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="course in courses" 
                  :key="course._id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ course.subject }}</h4>
                      <p class="text-sm text-gray-500">{{ formatDate(course.date) }} - {{ course.duration }}h</p>
                      <p v-if="course.notes" class="text-sm text-gray-600 mt-1">{{ course.notes }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span 
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusClass(course.status)
                        ]"
                      >
                        {{ getStatusText(course.status) }}
                      </span>
                      <div v-if="course.rating" class="flex items-center space-x-1">
                        <span class="text-sm text-gray-500">{{ course.rating }}/5</span>
                        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Progrès -->
            <div v-if="activeTab === 'progress'">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Progress Tracking</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Graphique des notes -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-3">Rating Evolution</h4>
                  <div class="h-32 flex items-end justify-between space-x-2">
                    <div 
                      v-for="(rating, index) in progressData.ratings" 
                      :key="index"
                      class="flex-1 flex flex-col items-center"
                    >
                      <div 
                        class="w-full bg-purple-200 rounded-t transition-all duration-300"
                        :style="{ height: `${(rating / 5) * 100}%` }"
                      ></div>
                      <span class="text-xs text-gray-500 mt-1">{{ rating }}/5</span>
                    </div>
                  </div>
                </div>

                <!-- Objectifs -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-3">Goals</h4>
                  <div class="space-y-3">
                    <div 
                      v-for="goal in progressData.goals" 
                      :key="goal.id"
                      class="flex items-center justify-between"
                    >
                      <span class="text-sm text-gray-700">{{ goal.description }}</span>
                      <div class="flex items-center space-x-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-green-500 h-2 rounded-full transition-all duration-300"
                            :style="{ width: `${goal.progress}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500">{{ goal.progress }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Notes -->
            <div v-if="activeTab === 'notes'">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Notes and Observations</h3>
                <button 
                  @click="addNote"
                  class="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add a note
                </button>
              </div>
              
              <div v-if="notes.length === 0" class="text-center py-8">
                <p class="text-gray-500">No notes yet</p>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="note in notes" 
                  :key="note.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="text-gray-900">{{ note.content }}</p>
                      <p class="text-sm text-gray-500 mt-2">{{ formatDate(note.createdAt) }}</p>
                    </div>
                    <button 
                      @click="deleteNote(note.id)"
                      class="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
// Get student ID from URL
const route = useRoute();
const studentId = route.params.id;

// Get user
const { user } = useAuth();

// Reactive state
const loading = ref(false);
const student = ref(null);
const activeTab = ref('courses');
const courses = ref([]);
const notes = ref([]);

// Progress data
const progressData = ref({
  ratings: [4.2, 4.5, 4.8, 4.3, 4.7, 4.9],
  goals: [
    { id: 1, description: 'Master quadratic equations', progress: 75 },
    { id: 2, description: 'Improve writing skills', progress: 60 },
    { id: 3, description: 'Pass the final exam', progress: 90 }
  ]
});

// Tabs
const tabs = [
  { id: 'courses', name: 'Courses' },
  { id: 'progress', name: 'Progress' },
  { id: 'notes', name: 'Notes' }
];

// Methods
const loadStudentDetails = async () => {
  try {
    loading.value = true;
    
    // Simulate data for example
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    student.value = {
      _id: studentId,
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice.martin@email.com',
      phone: '06 12 34 56 78',
      status: 'active',
      subjects: ['Mathematics', 'Physics'],
      totalCourses: 12,
      totalHours: 24,
      averageRating: 4.8,
      recentProgress: 85,
      createdAt: new Date('2023-09-01')
    };

    // Load courses
    courses.value = [
      {
        _id: '1',
        subject: 'Mathematics',
        date: new Date('2024-01-20'),
        duration: 2,
        status: 'completed',
        rating: 5,
        notes: 'Very good session on derivatives'
      },
      {
        _id: '2',
        subject: 'Physics',
        date: new Date('2024-01-15'),
        duration: 1.5,
        status: 'completed',
        rating: 4,
        notes: 'Review of Newton\'s laws'
      },
      {
        _id: '3',
        subject: 'Mathematics',
        date: new Date('2024-01-10'),
        duration: 2,
        status: 'completed',
        rating: 5,
        notes: 'Introduction to integrals'
      }
    ];

    // Load notes
    notes.value = [
      {
        id: 1,
        content: 'Alice shows an excellent level in mathematics. She quickly understands concepts and asks good questions.',
        createdAt: new Date('2024-01-18')
      },
      {
        id: 2,
        content: 'Notable progress in physics. Should focus more on practical problem solving.',
        createdAt: new Date('2024-01-12')
      }
    ];

  } catch (error) {
    console.error('Error loading details:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
    case 'completed': return 'bg-green-100 text-green-800';
    case 'inactive':
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'completed': return 'Completed';
    case 'pending': return 'Pending';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US');
};

const goBack = () => {
  navigateTo('/teacher/students');
};

const sendMessage = () => {
  navigateTo(`/messages?student=${studentId}`);
};

const scheduleCourse = () => {
  navigateTo(`/teacher/schedule?student=${studentId}`);
};

const addNote = () => {
  // TODO: Implement note addition
  console.log('Add a note');
};

const deleteNote = (noteId) => {
  // TODO: Implement note deletion
  console.log('Delete note:', noteId);
};

// Lifecycle
onMounted(() => {
  loadStudentDetails();
});
</script>
