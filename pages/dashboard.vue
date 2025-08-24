<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Dashboard Administrateur -->
    <AdminDashboard v-if="user?.role === 'admin'" />
    
    <!-- Dashboard Enseignant -->
    <TeacherDashboard v-else-if="user?.role === 'teacher'" />
    
    <!-- Dashboard Étudiant -->
    <StudentDashboard v-else-if="user?.role === 'student'" />
    
    <!-- Fallback pour rôle non reconnu -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
        <p class="text-gray-600 mb-4">Votre rôle n'est pas reconnu ou vous n'êtes pas connecté.</p>
        <NuxtLink to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Se connecter
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification et configuration de la page
definePageMeta({
  middleware: 'auth',
  title: 'Tableau de bord'
});

// Récupérer l'utilisateur connecté
const { user } = useAuth();
</script>
