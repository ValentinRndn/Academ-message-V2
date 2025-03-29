<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white shadow rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Teacher not found</h3>
      <p class="mt-1 text-gray-500">The teacher you're looking for doesn't exist or has been removed.</p>
      <div class="mt-6">
        <NuxtLink to="/teachers" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
          Back to Teachers
        </NuxtLink>
      </div>
    </div>
    
    <!-- Teacher profile -->
    <div v-else>
      <!-- Back button -->
      <div class="mb-6">
        <NuxtLink to="/teachers" class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Teachers
        </NuxtLink>
      </div>
      
      <!-- Main profile card -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <!-- Profile header -->
        <div class="bg-indigo-600 h-32 flex items-end">
          <div class="container mx-auto px-6 pb-4">
            <h1 class="text-2xl font-bold text-white">Teacher Profile</h1>
          </div>
        </div>
        
        <!-- Profile avatar and basic info -->
        <div class="container mx-auto px-6 -mt-12">
          <div class="flex flex-col md:flex-row md:items-end">
            <div class="flex-shrink-0">
              <img 
                :src="teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                :alt="`${teacher.firstName} ${teacher.lastName}`" 
                class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
            <div class="mt-4 md:mt-0 md:ml-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</h2>
              <div class="flex items-center mt-1">
                <div class="flex items-center">
                  <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-1 text-sm text-gray-600">
                  {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'No ratings' }} 
                  {{ teacher.reviewCount ? `(${teacher.reviewCount} reviews)` : '' }}
                </span>
              </div>
            </div>
            <div class="mt-6 md:mt-0 md:ml-auto">
              <span class="text-lg font-bold text-gray-900">$50/hour</span>
            </div>
          </div>
        </div>
        
        <!-- Profile content -->
        <div class="container mx-auto px-6 py-8">
          <!-- Subjects -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Subjects</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="subject in teacher.subjects" 
                :key="subject.id"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {{ subject.name }}
              </span>
            </div>
          </div>
          
          <!-- Bio -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">About</h3>
            <p class="text-gray-700 whitespace-pre-line">{{ teacher.bio || 'No bio available' }}</p>
          </div>
          
          <!-- Availability -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Availability</h3>
            <div v-if="teacher.availability && teacher.availability.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(avail, index) in teacher.availability" :key="index" class="bg-gray-50 p-3 rounded-md">
                <div class="font-medium">{{ getDayName(avail.dayOfWeek) }}</div>
                <div class="text-sm text-gray-600">
                  {{ formatTime(avail.startTime) }} - {{ formatTime(avail.endTime) }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">No availability information</div>
          </div>
          
          <!-- Reviews -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Reviews</h3>
              <span class="text-sm text-gray-500">{{ teacher.teacherReviews ? teacher.teacherReviews.length : 0 }} reviews</span>
            </div>
            
            <div v-if="!teacher.teacherReviews || teacher.teacherReviews.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p class="mt-2 text-gray-500">No reviews yet</p>
            </div>
            
            <div v-else class="space-y-6">
              <div v-for="review in teacher.teacherReviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div class="flex items-start">
                  <img 
                    :src="review.student.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                    :alt="`${review.student.firstName} ${review.student.lastName}`" 
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div class="ml-4">
                    <div class="flex items-center">
                      <h4 class="text-sm font-medium text-gray-900">{{ review.student.firstName }} {{ review.student.lastName }}</h4>
                      <span class="mx-2 text-gray-500">•</span>
                      <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                      <div class="flex items-center">
                        <svg v-for="i in 5" :key="i" :class="[i <= review.rating ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <p class="mt-2 text-gray-700">{{ review.comment || 'No comment provided' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="startConversation"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Start Conversation
        </button>
        <button 
          @click="bookSession"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book a Session
        </button>
      </div>
    </div>
    
    <!-- Booking modal -->
    <div v-if="showBookingModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Book a Session with {{ teacher.firstName }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Select a date and time for your session. You'll be able to discuss details in your conversation.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-6 space-y-4">
              <!-- Date picker -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                <input 
                  id="date" 
                  type="date" 
                  v-model="bookingDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <!-- Time slots -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Available Time Slots</label>
                <div class="mt-2 grid grid-cols-3 gap-2">
                  <button 
                    v-for="slot in availableTimeSlots" 
                    :key="slot.value"
                    @click="selectTimeSlot(slot.value)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-md',
                      selectedTimeSlot === slot.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    ]"
                  >
                    {{ slot.label }}
                  </button>
                </div>
              </div>
              
              <!-- Duration -->
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700">Duration</label>
                <select 
                  id="duration" 
                  v-model="bookingDuration"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              
              <!-- Total price -->
              <div class="pt-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700">Total Price:</span>
                  <span class="text-lg font-bold text-gray-900">${{ calculateTotalPrice() }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  You will only be charged after the session is completed.
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmBooking"
              :disabled="!isBookingValid"
              :class="[
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm',
                isBookingValid 
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-indigo-300 cursor-not-allowed'
              ]"
            >
              Confirm Booking
            </button>
            <button 
              @click="showBookingModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const teacherId = route.params.id;

// State
const loading = ref(true);
const error = ref(false);
const teacher = ref(null);
const showBookingModal = ref(false);
const bookingDate = ref('');
const selectedTimeSlot = ref('');
const bookingDuration = ref('60');

// Time slots
const availableTimeSlots = [
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '1:00 PM', value: '13:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  { label: '4:00 PM', value: '16:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '6:00 PM', value: '18:00' },
];

// Computed
const isBookingValid = computed(() => {
  return bookingDate.value && selectedTimeSlot;
});

// Methods
const fetchTeacher = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const response = await fetch(`/api/teachers/${teacherId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        error.value = true;
      } else {
        throw new Error('Failed to fetch teacher details');
      }
      return;
    }
    
    teacher.value = await response.json();
  } catch (err) {
    console.error('Error fetching teacher:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const startConversation = () => {
  // In a real app, this would create a conversation and redirect to the messages page
  router.push(`/messages?teacher=${teacherId}`);
};

const bookSession = () => {
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  bookingDate.value = tomorrow.toISOString().split('T')[0];
  
  // Show booking modal
  showBookingModal.value = true;
};

const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot;
};

const calculateTotalPrice = () => {
  const durationInHours = parseInt(bookingDuration.value) / 60;
  return (50 * durationInHours).toFixed(2); // Using fixed price of $50/hour
};

const confirmBooking = () => {
  // In a real app, this would create a booking and redirect to the messages page
  showBookingModal.value = false;
  
  // Redirect to messages page
  router.push(`/messages?teacher=${teacherId}`);
};

const getDayName = (dayOfWeek) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || '';
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Lifecycle
onMounted(() => {
  fetchTeacher();
});
</script>
