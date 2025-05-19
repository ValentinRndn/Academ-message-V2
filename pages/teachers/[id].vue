<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Background decorative elements -->
    <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
    
    <!-- Loading state with animation -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 animate-fade-in">
      <div class="teacher-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p class="mt-6 text-gray-500">Loading teacher profile...</p>
    </div>
    
    <!-- Error state with animation -->
    <div v-else-if="error" class="bg-white shadow-xl rounded-xl p-10 text-center max-w-md mx-auto animate-fade-in">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Teacher not found</h3>
      <p class="text-gray-600 mb-8">The teacher you're looking for doesn't exist or has been removed from our platform.</p>
      <NuxtLink to="/teachers" class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Teachers
      </NuxtLink>
    </div>
    
    <!-- Teacher profile with animations -->
    <div v-else class="relative">
      <!-- Back button with hover effect -->
      <div class="mb-8 animate-fade-in">
        <NuxtLink to="/teachers" class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Teachers
        </NuxtLink>
      </div>
      
      <!-- Main profile card with shadow and animation -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden mb-10 animate-fade-in-up">
        <!-- Cover image area with gradient -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 h-48 relative">
          <div class="absolute top-0 right-0 p-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700 shadow-md">
              Available Now
            </span>
          </div>
          <div class="absolute bottom-4 left-6">
            <h1 class="text-2xl font-bold text-white">Teacher Profile</h1>
          </div>
          
          <!-- Decorative elements -->
          <div class="absolute inset-0 overflow-hidden opacity-10">
            <div class="absolute top-10 right-10 w-40 h-40 rounded-full border-4 border-white"></div>
            <div class="absolute -bottom-20 -left-10 w-60 h-60 rounded-full border-8 border-white opacity-20"></div>
          </div>
        </div>
        
        <!-- Profile avatar and basic info with animations -->
        <div class="container mx-auto px-6 py-6 relative">
          <div class="flex flex-col md:flex-row md:items-center -mt-24">
            <div class="flex-shrink-0 animate-fade-in" style="animation-delay: 0.1s;">
              <div class="relative group">
                <img 
                  :src="teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                  :alt="`${teacher.firstName} ${teacher.lastName}`" 
                  class="w-32 h-32 rounded-xl border-4 border-white shadow-xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute bottom-3 right-3 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-6 md:mt-0 md:ml-6 animate-fade-in-up" style="animation-delay: 0.2s;">
              <h2 class="text-3xl font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</h2>
              <div class="flex flex-wrap items-center mt-2 gap-3">
                <div class="flex items-center">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-base text-gray-700 font-medium">
                    {{ teacher.averageRating ? teacher.averageRating.toFixed(1) : 'No ratings' }}
                  </span>
                  <span v-if="teacher.reviewCount" class="text-sm text-gray-500 ml-1">
                    ({{ teacher.reviewCount }} reviews)
                  </span>
                </div>
                
                <span class="h-5 w-px bg-gray-300 mx-2"></span>
                
                <div class="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm">Quick Response</span>
                </div>
                
                <span class="h-5 w-px bg-gray-300 mx-2"></span>
                
                <div class="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-sm">{{ calculateSessionsCount() }} Sessions</span>
                </div>
              </div>
            </div>
            <div class="mt-6 md:mt-0 md:ml-auto animate-fade-in" style="animation-delay: 0.3s;">
              <div class="bg-indigo-50 p-4 rounded-xl shadow-sm text-center">
                <span class="block text-lg font-bold text-indigo-700">${{ teacher.hourlyRate || 50 }}/hour</span>
                <span class="text-sm text-gray-600">Professional Rate</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Profile content with animations -->
        <div class="container mx-auto px-8 pb-10 animate-fade-in-up" style="animation-delay: 0.4s;">
          <!-- Quick Actions Bar -->
          <div class="mb-10 flex flex-wrap justify-center gap-3 p-4 rounded-xl bg-gray-50 shadow-inner">
            <button 
              @click="startConversation"
              class="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message
            </button>
            <button 
              @click="bookSession"
              class="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a Session
            </button>
            <button class="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Profile
            </button>
            <button class="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save
            </button>
          </div>
          
          <!-- Main content grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Left column - Bio and details -->
            <div class="md:col-span-2 space-y-8">
              <!-- Subjects with animation -->
              <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Subjects Taught
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="subject in teacher.subjects" 
                    :key="subject.id"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 animate-pop-in hover:bg-indigo-200 transition-colors cursor-default"
                  >
                    {{ subject.name }}
                  </span>
                  <span v-if="!teacher.subjects || teacher.subjects.length === 0" class="text-gray-500 italic">
                    No subjects specified
                  </span>
                </div>
              </div>
              
              <!-- Bio section -->
              <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About {{ teacher.firstName }}
                </h3>
                <div class="prose prose-indigo max-w-none">
                  <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ teacher.bio || 'No biography information available yet.' }}</p>
                </div>
                
                <!-- Teacher stats -->
                <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                  <div class="text-center">
                    <div class="text-xl font-bold text-indigo-600">{{ calculateExperience() }}+</div>
                    <div class="text-sm text-gray-500">Years Experience</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-indigo-600">{{ calculateSessionsCount() }}</div>
                    <div class="text-sm text-gray-500">Sessions Completed</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-indigo-600">{{ calculateStudentCount() }}</div>
                    <div class="text-sm text-gray-500">Students Helped</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-bold text-indigo-600">100%</div>
                    <div class="text-sm text-gray-500">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
              
              <!-- Reviews section -->
              <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Student Reviews
                  </h3>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {{ teacher.teacherReviews ? teacher.teacherReviews.length : 0 }} reviews
                  </span>
                </div>
                
                <div v-if="!teacher.teacherReviews || teacher.teacherReviews.length === 0" class="bg-gray-50 rounded-xl p-8 text-center">
                  <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 class="text-base font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                  <p class="text-gray-600 mb-4">Be the first to leave a review after your session with {{ teacher.firstName }}.</p>
                </div>
                
                <div v-else>
                  <!-- Rating distribution -->
                  <div class="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center mb-4">
                      <div class="flex mr-4">
                        <svg v-for="i in 5" :key="i" :class="[i <= (teacher.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div class="text-xl font-bold text-gray-900">{{ teacher.averageRating ? teacher.averageRating.toFixed(1) : '0.0' }}</div>
                      <span class="text-sm text-gray-500 ml-2">out of 5</span>
                    </div>
                    
                    <div class="space-y-2">
                      <div v-for="rating in 5" :key="rating" class="flex items-center">
                        <div class="w-10 text-sm text-gray-700">{{ 6 - rating }} star</div>
                        <div class="w-full mx-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-yellow-400 rounded-full" 
                            :style="`width: ${calculateRatingPercentage(6 - rating)}%`"
                          ></div>
                        </div>
                        <div class="w-10 text-xs text-gray-500">{{ calculateRatingCount(6 - rating) }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Reviews list -->
                  <div class="space-y-6">
                    <div v-for="(review, index) in teacher.teacherReviews" :key="review.id" 
                      class="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 animate-fade-in-up"
                      :style="`animation-delay: ${0.1 + (index * 0.1)}s`"
                    >
                      <div class="flex items-start">
                        <img 
                          :src="review.student.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                          :alt="`${review.student.firstName} ${review.student.lastName}`" 
                          class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div class="ml-4 flex-1">
                          <div class="flex flex-wrap items-center mb-1">
                            <h4 class="text-sm font-medium text-gray-900">{{ review.student.firstName }} {{ review.student.lastName }}</h4>
                            <span class="mx-2 text-gray-300">•</span>
                            <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                          </div>
                          <div class="flex items-center mb-3">
                            <div class="flex items-center">
                              <svg v-for="i in 5" :key="i" :class="[i <= review.rating ? 'text-yellow-400' : 'text-gray-300']" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                            
                            <div class="ml-2 text-xs">
                              <span class="text-indigo-600 font-medium">{{ getReviewSubject(review) }}</span>
                            </div>
                          </div>
                          <p class="text-gray-700">{{ review.comment || 'No comment provided' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- View all reviews button -->
                  <div v-if="teacher.teacherReviews && teacher.teacherReviews.length > 3" class="mt-6 text-center">
                    <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View all {{ teacher.teacherReviews.length }} reviews
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right column - Availability and Booking -->
            <div class="space-y-8">
              <!-- Availability widget -->
              <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Availability
                </h3>
                
                <div v-if="teacher.availability && teacher.availability.length > 0" class="space-y-3">
                  <div v-for="(avail, index) in teacher.availability" :key="index" 
                    class="bg-gray-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors cursor-default"
                  >
                    <div>
                      <div class="font-medium text-gray-900">{{ getDayName(avail.dayOfWeek) }}</div>
                      <div class="text-sm text-gray-600">
                        {{ formatTime(avail.startTime) }} - {{ formatTime(avail.endTime) }}
                      </div>
                    </div>
                    <button 
                      @click="bookSessionForDay(avail.dayOfWeek)"
                      class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>
                
                <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
                  <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-gray-600 mb-3">No availability information yet</p>
                  <button 
                    @click="bookSession"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Request Session
                  </button>
                </div>
              </div>
              
              <!-- Quick booking widget -->
              <div class="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
                <h3 class="text-lg font-semibold mb-4">Book Your First Session</h3>
                <p class="text-indigo-100 mb-6">Get started with {{ teacher.firstName }} today and improve your academic performance.</p>
                
                <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span>First Session Special</span>
                    <span class="font-medium">30 min</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold">$25</span>
                    <span class="text-indigo-200 line-through">${{ 25 * 2 }}</span>
                  </div>
                </div>
                
                <button 
                  @click="bookDiscountedSession"
                  class="w-full py-3 px-4 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors transform hover:scale-105 duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Book Discounted Session
                </button>
              </div>
              
              <!-- Contact information -->
              <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                
                <div class="space-y-3">
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Email</div>
                      <div class="text-gray-600">{{ teacher.email || 'Not available' }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Education</div>
                      <div class="text-gray-600">{{ teacher.education || 'University of Education' }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Location</div>
                      <div class="text-gray-600">{{ teacher.location || 'Remote Teaching' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.6s;">
        <button 
          @click="startConversation"
          class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Start Conversation
        </button>
        <button 
          @click="bookSession"
          class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all duration-300 transform hover:translate-y-[-2px] shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book a Session
        </button>
      </div>
    </div>
    
    <!-- Booking modal with animation -->
    <div v-if="showBookingModal" class="fixed inset-0 z-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay with animation -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in" aria-hidden="true"></div>
        
        <!-- Modal panel with entrance animation -->
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modal-in">
          <div class="relative">
            <!-- Modal header with gradient -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-500">
              <div class="flex items-center">
                <div class="mr-4">
                  <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg leading-6 font-semibold text-white" id="modal-title">
                    Book a Session with {{ teacher.firstName }}
                  </h3>
                  <p class="text-sm text-indigo-100 mt-1">
                    Select a date and time that works for you
                  </p>
                </div>
              </div>
              
              <!-- Close button -->
              <button 
                @click="showBookingModal = false"
                class="absolute top-4 right-4 text-white hover:text-indigo-100 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Modal body -->
            <div class="p-6">
              <div class="space-y-6">
                <!-- Date picker with animation -->
                <div class="animate-fade-in" style="animation-delay: 100ms;">
                  <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      id="date" 
                      type="date" 
                      v-model="bookingDate"
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                
                <!-- Time slots with animation -->
                <div class="animate-fade-in" style="animation-delay: 200ms;">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button 
                      v-for="slot in availableTimeSlots" 
                      :key="slot.value"
                      @click="selectTimeSlot(slot.value)"
                      :class="[
                        'px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-sm transform',
                        selectedTimeSlot === slot.value
                          ? 'bg-indigo-600 text-white scale-105'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                      ]"
                    >
                      {{ slot.label }}
                    </button>
                  </div>
                </div>
                
                <!-- Duration with animation -->
                <div class="animate-fade-in" style="animation-delay: 300ms;">
                  <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Session Duration</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select 
                      id="duration" 
                      v-model="bookingDuration"
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                
                <!-- Total price with animation -->
                <div class="animate-fade-in" style="animation-delay: 400ms;">
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Hourly Rate:</span>
                      <span class="text-sm text-gray-700">${{ teacher.hourlyRate || 50 }}/hour</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Duration:</span>
                      <span class="text-sm text-gray-700">{{ bookingDuration }} minutes</span>
                    </div>
                    <div class="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                      <span class="text-base font-bold text-gray-900">Total Price:</span>
                      <span class="text-xl font-bold text-indigo-600">${{ calculateTotalPrice() }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-2 text-center">
                      Payments are processed securely after your session is completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Modal footer -->
            <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row-reverse sm:justify-between sm:space-x-reverse sm:space-x-3">
              <button 
                @click="confirmBooking"
                :disabled="!isBookingValid"
                :class="[
                  'w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-6 py-3 text-base font-medium sm:w-auto sm:text-sm transition-all duration-300 transform',
                  isBookingValid 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    : 'bg-indigo-300 text-white cursor-not-allowed'
                ]"
              >
                <svg v-if="isBookingValid" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isBookingValid ? 'Confirm Booking' : 'Select Date & Time' }}
              </button>
              
              <button 
                @click="showBookingModal = false"
                type="button"
                class="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm transition-all duration-300"
              >
                Cancel
              </button>
            </div>
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
  return bookingDate.value && selectedTimeSlot.value;
});

// Methods
const fetchTeacher = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate API behavior
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock successful API response
    teacher.value = {
      id: teacherId,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@university.edu',
      bio: 'I am a dedicated mathematics teacher with over 10 years of experience helping students achieve their goals. My teaching approach focuses on building strong fundamentals and problem-solving skills.\n\nI specialize in calculus, differential equations, and linear algebra, and have helped hundreds of students improve their grades and understanding of these subjects.\n\nMy teaching philosophy is based on the belief that anyone can excel in mathematics with the right guidance and practice. I adapt my teaching style to match each student\'s learning pace and style.',
      subjects: [
        { id: '1', name: 'Calculus' },
        { id: '2', name: 'Differential Equations' },
        { id: '3', name: 'Linear Algebra' },
        { id: '4', name: 'Discrete Mathematics' }
      ],
      averageRating: 4.8,
      reviewCount: 47,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      hourlyRate: 50,
      education: 'PhD in Mathematics, Stanford University',
      location: 'Remote Teaching',
      availability: [
        { dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 3, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 5, startTime: '13:00:00', endTime: '18:00:00' }
      ],
      teacherReviews: [
        {
          id: '1',
          rating: 5,
          comment: 'John is an excellent teacher! He explained complex calculus concepts in a way that was easy to understand. I improved my grade from a C to an A after just a few sessions with him.',
          createdAt: '2023-03-15T14:30:00Z',
          subject: 'Calculus II',
          student: {
            firstName: 'Emma',
            lastName: 'Watson',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
          }
        },
        {
          id: '2',
          rating: 5,
          comment: 'I was struggling with differential equations until I started working with John. His methodical approach and clear explanations made all the difference. Highly recommend!',
          createdAt: '2023-02-22T10:15:00Z',
          subject: 'Differential Equations',
          student: {
            firstName: 'Michael',
            lastName: 'Brown',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
          }
        },
        {
          id: '3',
          rating: 4,
          comment: 'Very knowledgeable about linear algebra. Helped me prepare for my finals and I ended up getting a B+ when I was previously failing the class.',
          createdAt: '2023-01-05T16:45:00Z',
          subject: 'Linear Algebra',
          student: {
            firstName: 'Sophia',
            lastName: 'Garcia',
            avatar: 'https://randomuser.me/api/portraits/women/55.jpg'
          }
        }
      ]
    };
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

const bookDiscountedSession = () => {
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  bookingDate.value = tomorrow.toISOString().split('T')[0];
  
  // Set duration to 30 minutes
  bookingDuration.value = '30';
  
  // Show booking modal
  showBookingModal.value = true;
};

const bookSessionForDay = (dayOfWeek) => {
  // Find the next occurrence of this day
  const today = new Date();
  const dayDiff = (dayOfWeek - today.getDay() + 7) % 7;
  const nextOccurrence = new Date(today);
  nextOccurrence.setDate(today.getDate() + dayDiff);
  
  // Set the date
  bookingDate.value = nextOccurrence.toISOString().split('T')[0];
  
  // Show booking modal
  showBookingModal.value = true;
};

const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot;
};

const calculateTotalPrice = () => {
  const hourlyRate = teacher.value?.hourlyRate || 50;
  const durationInHours = parseInt(bookingDuration.value) / 60;
  return (hourlyRate * durationInHours).toFixed(2);
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
  
  // Handle different time formats
  let time;
  if (timeString.includes('T')) {
    // ISO format
    time = new Date(timeString);
  } else {
    // HH:MM:SS format
    const [hours, minutes] = timeString.split(':');
    time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
  }
  
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return '1 week ago';
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getReviewSubject = (review) => {
  return review.subject || 'General Review';
};

const calculateRatingPercentage = (rating) => {
  if (!teacher.value || !teacher.value.teacherReviews) return 0;
  
  const totalReviews = teacher.value.teacherReviews.length;
  if (totalReviews === 0) return 0;
  
  const ratingCount = teacher.value.teacherReviews.filter(r => Math.round(r.rating) === rating).length;
  return (ratingCount / totalReviews) * 100;
};

const calculateRatingCount = (rating) => {
  if (!teacher.value || !teacher.value.teacherReviews) return 0;
  return teacher.value.teacherReviews.filter(r => Math.round(r.rating) === rating).length;
};

const calculateExperience = () => {
  return Math.floor(Math.random() * 10) + 5; // Random number between 5-15
};

const calculateSessionsCount = () => {
  return Math.floor(Math.random() * 100) + 50; // Random number between 50-150
};

const calculateStudentCount = () => {
  return Math.floor(Math.random() * 50) + 20; // Random number between 20-70
};

// Lifecycle
onMounted(() => {
  fetchTeacher();
  
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  bookingDate.value = tomorrow.toISOString().split('T')[0];
});
</script>

<style scoped>
/* Modal animations */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out forwards;
}

/* Fade in animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
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

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Pop in animation for tags */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop-in {
  animation: pop-in 0.3s ease-out forwards;
}

/* Custom loader */
.teacher-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-loader div {
  width: 16px;
  height: 16px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: #6366F1; /* indigo-500 */
  animation: teacher-loader 1.5s infinite ease-in-out both;
}

.teacher-loader div:nth-child(1) {
  animation-delay: -0.3s;
}

.teacher-loader div:nth-child(2) {
  animation-delay: -0.15s;
}

@keyframes teacher-loader {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* Blur effect for background decorations */
.blur-3xl {
  --tw-blur: blur(64px);
  filter: var(--tw-blur);
}
</style>