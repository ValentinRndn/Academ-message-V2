<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Availability</h2>
      <p class="text-gray-600 mb-6">
        Set your availability for teaching sessions. Students will be able to book sessions during these times.
      </p>
      
      <div v-if="isEditing">
        <!-- Editing Mode -->
        <div class="space-y-6">
          <!-- Days of the week -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Days Available</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="day in daysOfWeek"
                :key="day.value"
                @click="toggleDay(day.value)"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium',
                  availableDays.includes(day.value)
                    ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ day.label }}
              </button>
            </div>
          </div>
          
          <!-- Time slots -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
            <div class="space-y-4">
              <div v-for="(slot, index) in timeSlots" :key="index" class="flex items-center space-x-4">
                <div class="grid grid-cols-2 gap-4 flex-grow">
                  <div>
                    <label :for="`startTime-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      :id="`startTime-${index}`"
                      v-model="slot.startTime"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label :for="`endTime-${index}`" class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      :id="`endTime-${index}`"
                      v-model="slot.endTime"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div class="flex items-end pb-1">
                  <button
                    @click="removeTimeSlot(index)"
                    class="text-red-500 hover:text-red-700"
                    title="Remove time slot"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                @click="addTimeSlot"
                class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Time Slot
              </button>
            </div>
          </div>
          
          <!-- Save/Cancel buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="isEditing = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveAvailability"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
      
      <div v-else>
        <!-- View Mode -->
        <div class="space-y-6">
          <!-- Days of the week -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Days Available</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="day in daysOfWeek.filter(d => availableDays.includes(d.value))"
                :key="day.value"
                class="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium"
              >
                {{ day.label }}
              </span>
              <p v-if="availableDays.length === 0" class="text-gray-500 italic">
                No days set
              </p>
            </div>
          </div>
          
          <!-- Time slots -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
            <div class="space-y-2">
              <div
                v-for="(slot, index) in timeSlots"
                :key="index"
                class="px-4 py-2 bg-gray-50 rounded-md"
              >
                {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
              </div>
              <p v-if="timeSlots.length === 0" class="text-gray-500 italic">
                No time slots set
              </p>
            </div>
          </div>
          
          <!-- Edit button -->
          <div class="pt-4">
            <button
              @click="isEditing = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  teacherId: {
    type: String,
    required: true
  }
});

// State
const isEditing = ref(false);
const availableDays = ref(['monday', 'wednesday', 'friday']);
const timeSlots = ref([
  { startTime: '09:00', endTime: '12:00' },
  { startTime: '14:00', endTime: '17:00' }
]);

// Days of the week
const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

// Methods
const toggleDay = (day) => {
  if (availableDays.value.includes(day)) {
    availableDays.value = availableDays.value.filter(d => d !== day);
  } else {
    availableDays.value.push(day);
  }
};

const addTimeSlot = () => {
  timeSlots.value.push({ startTime: '09:00', endTime: '17:00' });
};

const removeTimeSlot = (index) => {
  timeSlots.value.splice(index, 1);
};

const saveAvailability = async () => {
  // In a real app, this would be an API call
  console.log('Saving availability:', {
    teacherId: props.teacherId,
    days: availableDays.value,
    timeSlots: timeSlots.value
  });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  isEditing.value = false;
  
  // Show success message (in a real app)
  console.log('Availability saved successfully');
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Lifecycle
onMounted(() => {
  // In a real app, you would fetch the teacher's availability from the API
  console.log('TeacherAvailability component mounted for teacher ID:', props.teacherId);
});
</script>
