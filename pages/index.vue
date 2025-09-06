<template>
  <div class="landing-page overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="min-h-screen relative flex items-center">
      <!-- Subtle diagonal pattern background -->
      <div class="absolute inset-0 -z-10 bg-diagonal-pattern"></div>
      <!-- Subtle decorative element -->
      <div class="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-purple-200/20 blur-2xl"></div>
      <div class="absolute bottom-1/3 left-1/3 h-48 w-48 rounded-full bg-purple-200/20 blur-3xl"></div>
      
      <!-- Navigation -->
      <div class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm py-4">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Nuxt-link to="/">
            <img src="/assets/images/logo_academ.png" alt="Academ Logo" class="w-12 h-12" />
          </Nuxt-link>
            <span class="sr-only">Message</span>
          </div>
          
          <div class="flex items-center gap-4">
            <NuxtLink to="/login" class="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors">Connexion</NuxtLink>
            <NuxtLink to="/register" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm">Inscription</NuxtLink>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-28 relative z-10">
        <div class="grid md:grid-cols-5 gap-8 items-center">
          <div class="md:col-span-3 animate-fade-in-up">
            <div class="relative">
              <h1 class="relative text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                <span class="text-purple-600 relative">
                  Connectez-vous
                  <span class="absolute bottom-0 left-0 w-full h-1 bg-purple-200"></span>
                </span>
                <br class="hidden md:block" /> aux meilleurs experts académiques
              </h1>
            </div>
            <p class="text-xl text-gray-600 mb-8 max-w-xl relative backdrop-blur-sm bg-white/30 p-4 rounded-lg shadow-sm">
              Une plateforme qui connecte les étudiants avec des enseignants qualifiés pour un soutien scolaire personnalisé et efficace.
            </p>
            
            <!-- Points forts avec style amélioré -->
            <div class="flex flex-wrap gap-4 mb-10">
              <div class="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm hover:bg-white transition-all">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">Cours personnalisés</span>
              </div>
              <div class="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm hover:bg-white transition-all">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">Experts vérifiés</span>
              </div>
              <div class="flex items-center gap-2 bg-white/80 py-2 px-4 rounded-full shadow-sm hover:bg-white transition-all">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">Flexibilité horaire</span>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-4">
              <NuxtLink 
                to="/register" 
                class="group px-8 py-4 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-500 transform hover:translate-y-[-2px] transition-all shadow-lg hover:shadow-purple-200/50 flex items-center justify-center"
              >
                <span>Commencer</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
              <NuxtLink 
                to="/teachers" 
                class="group px-8 py-4 bg-white text-purple-600 font-medium rounded-xl transform hover:translate-y-[-2px] transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <span>Trouver un enseignant</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </NuxtLink>
            </div>
            
            <!-- Stats avec design simplifié -->
            <div class="mt-12 grid grid-cols-3 gap-4">
              <div class="text-center py-4 px-2 bg-white backdrop-blur-sm rounded-lg shadow-md transform hover:-translate-y-1 transition-all">
                <div class="flex justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-purple-500">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <p class="text-3xl font-bold text-purple-600">500+</p>
                <p class="text-gray-600 text-sm font-medium">Enseignants</p>
              </div>
              <div class="text-center py-4 px-2 bg-white backdrop-blur-sm rounded-lg shadow-md transform hover:-translate-y-1 transition-all">
                <div class="flex justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-purple-500">
                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                    <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                  </svg>
                </div>
                <p class="text-3xl font-bold text-purple-600">15k+</p>
                <p class="text-gray-600 text-sm font-medium">Étudiants</p>
              </div>
              <div class="text-center py-4 px-2 bg-white backdrop-blur-sm rounded-lg shadow-md transform hover:-translate-y-1 transition-all">
                <div class="flex justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-purple-400">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-3xl font-bold text-purple-600">98%</p>
                <p class="text-gray-600 text-sm font-medium">Satisfaction</p>
              </div>
            </div>
          </div>
          
          <!-- Hero Image/Chat Interface -->
          <div class="md:col-span-2 animate-fade-in">
            <div class="relative mx-auto">              
              <div class="relative bg-white p-6 rounded-2xl shadow-lg">

                <div class="flex items-center p-3 mb-4 border-b-[1px] border-opacity-10 border-b-gray-300">
                  <div class="flex space-x-2">
                    <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div class="text-sm text-gray-500 mx-auto font-medium">Academ</div>
                </div>
                
                <!-- Chat interface with typing animation -->
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">T</div>
                    <div class="bg-gray-100 rounded-xl rounded-tl-none p-3 text-sm">
                      <p>Bonjour ! Je suis disponible pour vous aider avec vos questions de calcul.</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-end">
                    <div class="bg-purple-100 rounded-xl rounded-tr-none p-3 text-sm">
                      <p>Super ! J'ai des difficultés avec les dérivées. Pouvons-nous programmer une session ?</p>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3 flex-shrink-0">E</div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">T</div>
                    <div class="bg-gray-100 rounded-xl rounded-tl-none p-3 text-sm">
                      <p>Bien sûr ! Je suis libre demain à 15h. Cela vous convient ?</p>
                    </div>
                  </div>
                  
                  <div class="animate-pulse flex items-start justify-end opacity-70">
                    <div class="bg-purple-100 rounded-xl rounded-tr-none p-3 text-sm flex items-center">
                      <span class="animate-pulse-dots">...</span>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3 flex-shrink-0">E</div>
                  </div>
                </div>
                
                <!-- Message input -->
                <div class="mt-4 flex">
                  <input type="text" placeholder="Tapez un message..." class="flex-1 bg-gray-100 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <button class="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                
                <!-- Simple testimonial sans bordure -->
                <div class="absolute -top-16 -right-12 bg-white rounded-lg p-3 shadow-sm max-w-[180px]">
                  <div class="flex items-center mb-2">
                    <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-medium">M</div>
                    <div class="text-xs font-medium ml-2">Marie L.</div>
                    <div class="ml-auto">
                      <div class="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600">« J'ai énormément progressé grâce à mon prof de maths. Merci ! »</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-purple-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Comment ça marche - Section avec effet parallax -->
    <section class="py-24 relative overflow-hidden" id="how-it-works">
      <!-- Arrière-plan avec effet parallax et motif -->
      <div class="absolute inset-0 bg-gradient-to-r from-purple-50 to-white -z-10"></div>
      <div class="absolute inset-0 -z-10 bg-how-it-works-pattern"></div>
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium inline-block mb-4">Processus simple</span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Comment fonctionne Academ</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre plateforme vous connecte facilement avec des experts académiques pour obtenir l'aide dont vous avez besoin
          </p>
        </div>
        
        <!-- Steps Grid -->
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Étape 1 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 relative">
            <!-- Élément décoratif -->
            <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto transform group-hover:scale-110 transition-transform">1</div>
            <h3 class="text-xl font-semibold mb-3 text-center">Créez votre compte</h3>
            <p class="text-gray-600 text-center mb-6">Inscrivez-vous en tant qu'étudiant ou connectez-vous en tant qu'enseignant vérifié pour accéder à toutes les fonctionnalités.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Étape 2 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 relative">
            <!-- Élément décoratif -->
            <div class="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto transform group-hover:scale-110 transition-transform">2</div>
            <h3 class="text-xl font-semibold mb-3 text-center">Trouvez le bon professeur</h3>
            <p class="text-gray-600 text-center mb-6">Parcourez les profils ou publiez vos besoins d'apprentissage pour trouver le professeur idéal.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg> 
              </span>
            </div>
          </div>
          
          <!-- Étape 3 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 relative">
            <!-- Élément décoratif -->
            <div class="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto transform group-hover:scale-110 transition-transform">3</div>
            <h3 class="text-xl font-semibold mb-3 text-center">Connectez-vous et apprenez</h3>
            <p class="text-gray-600 text-center mb-6">Échangez des messages, planifiez des sessions et collaborez via notre plateforme sécurisée.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pourquoi nous choisir - Section avec effet de "card hover" -->
    <section class="py-28 bg-white relative overflow-hidden">
      <!-- Éléments décoratifs en arrière-plan -->
      <div class="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-white -z-10"></div>
      <div class="absolute inset-0 -z-10 bg-features-pattern"></div>
      <div class="absolute top-20 right-0 w-72 h-72 bg-yellow-100/30 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 left-10 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium inline-block mb-4">Nos avantages</span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir Academ</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme conçue pour offrir la meilleure expérience d'apprentissage possible
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Carte 1 : Enseignants experts -->
          <div class="group bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <!-- Effet de fond au survol amélioré -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div class="absolute right-0 bottom-0 w-40 h-40 bg-purple-100 rounded-full -mr-20 -mb-20 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
            <div class="absolute left-0 top-0 w-20 h-20 bg-purple-100 rounded-full -ml-10 -mt-10 opacity-0 group-hover:opacity-10 transition-all duration-500 delay-100"></div>
            
            <div class="text-purple-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 p-5 inline-flex transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-105 group-hover:-rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Enseignants experts</h3>
            <p class="text-gray-600 text-center">Tous nos enseignants sont des professionnels vérifiés avec une expertise dans leurs domaines.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/teachers" 
                class="text-purple-600 font-medium hover:text-purple-800 inline-flex items-center group"
              >
                Parcourir les enseignants
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Carte 2 : Planning flexible -->
          <div class="group bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <!-- Effet de fond au survol amélioré -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div class="absolute right-0 bottom-0 w-40 h-40 bg-purple-100 rounded-full -mr-20 -mb-20 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
            <div class="absolute left-0 top-0 w-20 h-20 bg-purple-100 rounded-full -ml-10 -mt-10 opacity-0 group-hover:opacity-10 transition-all duration-500 delay-100"></div>
            
            <div class="text-purple-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 p-5 inline-flex transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-105 group-hover:rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Planning flexible</h3>
            <p class="text-gray-600 text-center">Réservez des sessions qui correspondent à votre emploi du temps et à votre rythme d'apprentissage.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/teachers" 
                class="text-purple-600 font-medium hover:text-purple-800 inline-flex items-center group"
              >
                Trouver des sessions disponibles
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Carte 3 : Plateforme sécurisée -->
          <div class="group bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <!-- Effet de fond au survol amélioré -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <div class="absolute right-0 bottom-0 w-40 h-40 bg-purple-100 rounded-full -mr-20 -mb-20 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
            <div class="absolute left-0 top-0 w-20 h-20 bg-purple-100 rounded-full -ml-10 -mt-10 opacity-0 group-hover:opacity-10 transition-all duration-500 delay-100"></div>
            
            <div class="text-purple-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 p-5 inline-flex transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-105 group-hover:rotate-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Plateforme sécurisée</h3>
            <p class="text-gray-600 text-center">Toutes les communications et transactions sont sécurisées et privées.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/messages" 
                class="text-purple-600 font-medium hover:text-purple-800 inline-flex items-center group"
              >
                Voir les messages
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Pour qui - Section avec deux colonnes -->
    <section class="py-24 relative overflow-hidden">
      <!-- Arrière-plan décoratif -->
      <div class="absolute inset-0 bg-gradient-to-br from-white via-purple-50/20 to-white -z-10"></div>
      <div class="absolute inset-0 -z-10 bg-for-who-pattern"></div>
      
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium inline-block mb-4">Pour tous</span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Une solution adaptée à chaque besoin</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Que vous soyez étudiant ou enseignant, notre plateforme est conçue pour vous
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <!-- Carte Étudiants -->
          <div class="group bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl text-3xl shadow-lg group-hover:shadow-purple-200 mb-6 transform group-hover:scale-105 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-3">Pour les étudiants</h2>
              <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Obtenez un soutien académique personnalisé de la part d'enseignants qualifiés
              </p>
            </div>
            
            <div class="flex-grow">
              <ul class="space-y-4 mb-10">
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Accès à des enseignants vérifiés dans diverses matières académiques</span>
                </li>
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Planifiez des sessions individuelles aux horaires qui vous conviennent</span>
                </li>
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Communiquez et échangez des fichiers via notre plateforme sécurisée</span>
                </li>
              </ul>
            </div>
            
            <div class="text-center mt-auto">
              <NuxtLink 
                to="/register" 
                class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-500 transform hover:translate-y-[-2px] transition-all shadow-lg hover:shadow-purple-200/50 w-full md:w-auto"
              >
                S'inscrire comme étudiant
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Carte Enseignants -->
          <div class="group bg-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl text-3xl shadow-lg group-hover:shadow-purple-200 mb-6 transform group-hover:scale-105 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-3">Pour les enseignants</h2>
              <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Partagez votre expertise et aidez les étudiants à réussir
              </p>
            </div>
            
            <div class="flex-grow">
              <ul class="space-y-4 mb-10">
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Créez un profil professionnel présentant votre expertise et vos qualifications</span>
                </li>
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Définissez votre propre disponibilité et vos tarifs horaires</span>
                </li>
                <li class="flex items-start p-4 rounded-xl bg-gradient-to-br from-white to-purple-50/40 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Connectez-vous avec des étudiants qui ont besoin de votre expertise spécifique</span>
                </li>
              </ul>
            </div>
            
            <div class="text-center mt-auto">
              <NuxtLink 
                to="/login" 
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-purple-700 bg-white hover:bg-purple-50 transform hover:translate-y-[-2px] transition-all shadow-lg hover:shadow-purple-100/50 w-full md:w-auto"
              >
                Se connecter en tant qu'enseignant
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Call to Action - Section avec effet de gradient dynamique -->
    <section class="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-700 text-white relative overflow-hidden">
      <!-- Éléments décoratifs -->
      <div class="absolute inset-0 bg-cta-pattern opacity-25"></div>
      
      <!-- Blob shapes -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      
      <div class="max-w-5xl mx-auto px-3 relative z-10">
        <div class="text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-sm">Prêt à commencer ?</h2>
          <p class="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants et d'enseignants qui utilisent déjà Academ pour atteindre l'excellence académique.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
            <NuxtLink 
              to="/register" 
              class="group px-8 py-4 bg-white text-purple-600 font-medium rounded-xl hover:bg-purple-50 transform hover:translate-y-[-2px] transition-all shadow-lg hover:shadow-purple-900/30 flex items-center justify-center"
            >
              <span>Créer un compte</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
            <NuxtLink 
              to="/teachers" 
              class="group px-8 py-4 bg-transparent text-white font-medium rounded-xl hover:bg-white/10 backdrop-blur-sm transform hover:translate-y-[-2px] transition-all flex items-center justify-center"
            >
              <span>Explorer les enseignants</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer moderne avec effet de blur -->
    <footer class="bg-gray-900 text-gray-300 py-16 relative overflow-hidden">
      <!-- Éléments décoratifs -->
      <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-800/10 blur-3xl"></div>
      <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-800/5 blur-3xl"></div>
      <!-- Motif subtil en fond -->
      <div class="absolute inset-0 bg-footer-pattern"></div>
      
      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div class="flex items-center mb-4">
              <span class="text-2xl font-bold text-white">Academ</span>
              <span class="text-purple-400 ml-1">Message</span>
            </div>
            <p class="text-gray-400 mb-6">Connecter les étudiants avec des enseignants qualifiés pour un soutien académique personnalisé.</p>
            <div class="flex space-x-4">
              <a href="#" aria-label="Twitter" class="bg-gray-800/80 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" class="bg-gray-800/80 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" class="bg-gray-800/80 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-5">Liens rapides</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Accueil</NuxtLink></li>
              <li><NuxtLink to="/teachers" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Trouver des enseignants</NuxtLink></li>
              <li><NuxtLink to="/messages" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Messages</NuxtLink></li>
              <li><NuxtLink to="/profile" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Mon profil</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-5">Légal</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Conditions d'utilisation</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Politique de confidentialité</NuxtLink></li>
              <li><NuxtLink to="/cookies" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><span class="text-xs text-purple-400">→</span> Politique de cookies</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-5">Contact</h3>
            <ul class="space-y-4">
              <li class="flex items-center">
                <div class="bg-gray-800/90 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-gray-400">support@academessage.com</span>
              </li>
              <li class="flex items-center">
                <div class="bg-gray-800/90 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span class="text-gray-400">+33 (0)1 23 45 67 89</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 mt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; 2025 Academ. Tous droits réservés.</p>
          <div class="mt-3 sm:mt-0 flex space-x-6">
            <NuxtLink to="/" class="hover:text-gray-400 transition-colors">Aide</NuxtLink>
            <NuxtLink to="/" class="hover:text-gray-400 transition-colors">Blog</NuxtLink>
            <NuxtLink to="/" class="hover:text-gray-400 transition-colors">FAQ</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Récupérer l'état d'authentification
const { user, isAuthenticated } = useAuth();

// Redirection automatique pour les utilisateurs connectés
watchEffect(() => {
  if (process.client && isAuthenticated.value && user.value) {
    // Rediriger vers le dashboard
    navigateTo('/dashboard');
  }
});

// Configuration de la page
definePageMeta({
  title: 'Academ - Plateforme d\'apprentissage',
  layout: 'default'
});
</script>

<style scoped>
/* Background patterns */
.bg-diagonal-pattern {
  background: repeating-linear-gradient(
    -45deg,
    rgba(124, 58, 237, 0.03),
    rgba(124, 58, 237, 0.03) 2px,
    rgba(255, 255, 255, 0) 2px,
    rgba(255, 255, 255, 0) 10px
  );
  z-index: 0;
  pointer-events: none;
}

.bg-how-it-works-pattern {
  background-color: rgba(0, 0, 0, 0);
  background-image: 
    radial-gradient(rgba(99, 102, 241, 0.1) 2px, transparent 2px), 
    radial-gradient(rgba(99, 102, 241, 0.07) 2px, transparent 2px);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

.bg-features-pattern {
  background-color: transparent;
  background-image: 
    linear-gradient(30deg, rgba(99, 102, 241, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(99, 102, 241, 0.05) 87.5%, rgba(99, 102, 241, 0.05)),
    linear-gradient(150deg, rgba(99, 102, 241, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(99, 102, 241, 0.05) 87.5%, rgba(99, 102, 241, 0.05)),
    linear-gradient(30deg, rgba(99, 102, 241, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(99, 102, 241, 0.05) 87.5%, rgba(99, 102, 241, 0.05)),
    linear-gradient(150deg, rgba(99, 102, 241, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(99, 102, 241, 0.05) 87.5%, rgba(99, 102, 241, 0.05));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
}

.bg-for-who-pattern {
  background-color: transparent;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, 0.05) 25%, rgba(99, 102, 241, 0.05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.05) 75%, rgba(99, 102, 241, 0.05) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
}

.bg-cta-pattern {
  background-image: 
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0.08) 10px, rgba(255, 255, 255, 0.08) 20px);
}

.bg-footer-pattern {
  background-image: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.025) 25%, transparent 25%), 
    linear-gradient(-45deg, rgba(255, 255, 255, 0.025) 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.025) 75%), 
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.025) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Animations avancées */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes float-slow {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-15px) translateX(15px); }
  100% { transform: translateY(0px) translateX(0px); }
}

@keyframes float-reverse {
  0% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
  100% { transform: translateY(0px); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-dots {
  0%, 20% { content: "."; }
  40% { content: ".."; }
  60%, 100% { content: "..."; }
}

@keyframes blob {
  0% { transform: scale(1); }
  33% { transform: scale(1.1); }
  66% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-slow-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

/* Animations classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-reverse {
  animation: float-reverse 7s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-pulse-slow {
  animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin-slow {
  animation: spin-slow 25s linear infinite;
}

.animate-spin-slow-reverse {
  animation: spin-slow-reverse 30s linear infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Effet des points de suspension animés */
.animate-pulse-dots::after {
  content: "...";
  animation: pulse-dots 1.5s infinite;
}

/* Hover effect */
.transform {
  transition-duration: 300ms;
}

/* Card height equalizer */
.flex-col {
  display: flex;
  flex-direction: column;
}

/* Additional utility */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>