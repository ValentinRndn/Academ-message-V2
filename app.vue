<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Ajouter la classe no-sidebar pour les pages sans sidebar
watch(() => route.path, (path) => {
  // Vérifier que nous sommes côté client
  if (process.client && document && document.body) {
    if (path === '/' || path === '/login' || path === '/register') {
      document.body.classList.add('no-sidebar')
    } else {
      document.body.classList.remove('no-sidebar')
    }
  }
}, { immediate: true })
</script>

<style>
html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
