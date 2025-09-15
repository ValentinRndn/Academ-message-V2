<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Simple layout without sidebar for authentication pages -->
    <main class="flex-1 overflow-auto bg-gray-50">
      <slot />
    </main>
    
    <!-- Toast notifications -->
    <ToastContainer />
  </div>
</template>

<script setup>
// No navigation or sidebar logic needed for auth pages
</script>

<style scoped>
/* Scrollbar customization for main content */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Ensure main content takes all available space */
.min-h-screen {
  min-height: 100vh;
}
</style>