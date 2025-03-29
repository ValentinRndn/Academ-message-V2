<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-indigo-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold hover:text-indigo-200">Academ Message</NuxtLink>
        <nav>
          <ul class="flex space-x-6">
            <li><NuxtLink to="/" class="hover:text-indigo-200">Home</NuxtLink></li>
            <li><NuxtLink to="/teachers" class="hover:text-indigo-200">Find Teachers</NuxtLink></li>
            <li><NuxtLink to="/messages" class="hover:text-indigo-200">Messages</NuxtLink></li>
            <li><NuxtLink to="/profile" class="hover:text-indigo-200">Profile</NuxtLink></li>
            <li><NuxtLink to="/admin/teachers" class="hover:text-indigo-200">Admin</NuxtLink></li>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
    
    <footer class="bg-gray-100 border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4 py-3 text-center text-gray-600">
        <p>&copy; 2025 Academ Message - Academic Messaging Platform</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add any layout-specific styles here */
</style>
