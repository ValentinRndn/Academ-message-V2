<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Administrator Dashboard -->
    <AdminDashboard v-if="user?.role === 'admin'" />
    
    <!-- Teacher Dashboard -->
    <TeacherDashboard v-else-if="user?.role === 'teacher'" />
    
    <!-- Student Dashboard -->
    <StudentDashboard v-else-if="user?.role === 'student'" />
    
    <!-- Fallback for unrecognized role -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Access not authorized</h1>
        <p class="text-gray-600 mb-4">Your role is not recognized or you are not logged in.</p>
        <NuxtLink to="/login" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Authentication middleware and page configuration
definePageMeta({
  title: 'Dashboard'
});

// Get connected user
const { user } = useAuth();

// Debug logs
console.log('🏠 Dashboard - User:', user.value);
console.log('🏠 Dashboard - Role:', user.value?.role);

onMounted(() => {
  console.log('🏠 Dashboard mounted');
});
</script>
