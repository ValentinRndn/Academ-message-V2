<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16">
          <img src="../assets/images/logo_academ.png" alt="logo-academ">
        </div>
      </div>

      <!-- Pending approval card -->
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="text-center">
          <!-- Icon -->
          <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>

          <!-- Title -->
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Compte en attente d'approbation
          </h2>

          <!-- Description -->
          <div class="space-y-4 text-gray-600">
            <p class="leading-relaxed">
              Votre demande d'inscription en tant que professeur a été soumise avec succès.
            </p>
            <p class="leading-relaxed">
              Un administrateur va examiner votre profil et vous recevrez un email de confirmation 
              une fois votre compte approuvé.
            </p>
            <p class="text-sm text-gray-500">
              Ce processus prend généralement entre 24 et 48 heures.
            </p>
          </div>

          <!-- Email notification info -->
          <div class="bg-blue-50 p-4 rounded-xl mt-6 border border-blue-100">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="text-left">
                <h4 class="text-sm font-medium text-blue-900 mb-1">
                  Email de notification envoyé
                </h4>
                <p class="text-sm text-blue-700">
                  Nous avons envoyé un email de confirmation à votre adresse. 
                  Vous recevrez un second email lorsque votre compte sera approuvé.
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 mt-8">
            <NuxtLink 
              to="/"
              class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              Retour à l'accueil
            </NuxtLink>
            
            <NuxtLink 
              to="/login"
              class="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200 inline-block"
            >
              Se connecter avec un autre compte
            </NuxtLink>
          </div>

          <!-- Contact info -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <p class="text-xs text-gray-500">
              Des questions ? Contactez-nous à 
              <a href="mailto:support@academ.com" class="text-purple-600 hover:text-purple-700 underline">
                support@academ.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Compte en attente - Academ',
  layout: 'default',
  auth: false
})
</script>