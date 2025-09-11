<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">My Statistics</h3>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      <p class="text-gray-500 mt-2">Loading statistics...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Lessons this month -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">Lessons this month</p>
            <p class="text-2xl font-bold text-purple-900">{{ stats.monthlyBookings }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-xs text-purple-600">
            {{ stats.monthlyGrowth > 0 ? '+' : '' }}{{ stats.monthlyGrowth }}% vs last month
          </span>
        </div>
      </div>

      <!-- Satisfaction Rate -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">Satisfaction</p>
            <p class="text-2xl font-bold text-green-900">{{ stats.satisfactionRate }}%</p>
          </div>
          <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        <div class="mt-2">
          <div class="flex items-center">
            <div class="flex-1 bg-green-200 rounded-full h-2">
              <div 
                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${stats.satisfactionRate}%` }"
              ></div>
            </div>
            <span class="text-xs text-green-600 ml-2">{{ stats.totalReviews }} reviews</span>
          </div>
        </div>
      </div>

      <!-- Hours Taught -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">Hours Taught</p>
            <p class="text-2xl font-bold text-purple-900">{{ stats.totalHours }}h</p>
          </div>
          <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-xs text-purple-600">
            {{ stats.weeklyHours }}h this week
          </span>
        </div>
      </div>

      <!-- Active Students -->
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-orange-600">Active Students</p>
            <p class="text-2xl font-bold text-orange-900">{{ stats.activeStudents }}</p>
          </div>
          <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2">
          <span class="text-xs text-orange-600">
            +{{ stats.newStudents }} this month
          </span>
        </div>
      </div>
    </div>

    <!-- Graphique des cours par jour -->
    <div class="mt-8">
      <h4 class="text-md font-medium text-gray-900 mb-4">Lessons per day (last 7 days)</h4>
      <div class="h-32 flex items-end justify-between space-x-2">
        <div 
          v-for="(day, index) in weeklyStats" 
          :key="index"
          class="flex-1 flex flex-col items-center"
        >
          <div 
            class="w-full bg-purple-200 rounded-t transition-all duration-300 hover:bg-purple-300"
            :style="{ height: `${(day.count / maxWeeklyCount) * 100}%` }"
          ></div>
          <span class="text-xs text-gray-500 mt-1">{{ day.day }}</span>
          <span class="text-xs font-medium text-gray-700">{{ day.count }}</span>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="text-md font-medium text-gray-900 mb-3">Quick Actions</h4>
      <div class="flex flex-wrap gap-2">
        <button 
          @click="exportStats"
          class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200 transition-colors"
        >
          Export Stats
        </button>
        <button 
          @click="viewDetailedStats"
          class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
        <button 
          @click="refreshStats"
          class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Props
const props = defineProps({
  teacherId: {
    type: String,
    required: true
  }
});

// Reactive state
const loading = ref(false);
const stats = ref({
  monthlyBookings: 0,
  monthlyGrowth: 0,
  satisfactionRate: 0,
  totalReviews: 0,
  totalHours: 0,
  weeklyHours: 0,
  activeStudents: 0,
  newStudents: 0
});

const weeklyStats = ref([
  { day: 'Mon', count: 0 },
  { day: 'Tue', count: 0 },
  { day: 'Wed', count: 0 },
  { day: 'Thu', count: 0 },
  { day: 'Fri', count: 0 },
  { day: 'Sat', count: 0 },
  { day: 'Sun', count: 0 }
]);

// Computed properties
const maxWeeklyCount = computed(() => {
  return Math.max(...weeklyStats.value.map(day => day.count), 1);
});

// Methods
const loadStats = async () => {
  try {
    loading.value = true;
    
    // Simulate data for example
    // In production, this would come from an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    stats.value = {
      monthlyBookings: 24,
      monthlyGrowth: 12,
      satisfactionRate: 96,
      totalReviews: 45,
      totalHours: 156,
      weeklyHours: 18,
      activeStudents: 8,
      newStudents: 3
    };

    weeklyStats.value = [
      { day: 'Mon', count: 3 },
      { day: 'Tue', count: 5 },
      { day: 'Wed', count: 2 },
      { day: 'Thu', count: 4 },
      { day: 'Fri', count: 6 },
      { day: 'Sat', count: 1 },
      { day: 'Sun', count: 0 }
    ];

  } catch (error) {
    console.error('Error loading statistics:', error);
  } finally {
    loading.value = false;
  }
};

const exportStats = () => {
  // TODO: Implement statistics export
  console.log('Export statistics');
};

const viewDetailedStats = () => {
  // TODO: Navigate to detailed statistics page
  console.log('View detailed statistics');
};

const refreshStats = () => {
  loadStats();
};

// Lifecycle
onMounted(() => {
  loadStats();
});
</script>
