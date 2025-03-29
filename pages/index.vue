<template>
  <div>
    <section class="py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Academ Message</h1>
        <p class="text-xl text-gray-600 mb-8">
          A secure messaging platform for academic institutions
        </p>
        <div class="flex justify-center space-x-4">
          <NuxtLink 
            to="/login" 
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Register
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gray-100">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Features</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-indigo-600 text-2xl mb-4">👨‍🏫</div>
            <h3 class="text-xl font-semibold mb-2">Find Expert Teachers</h3>
            <p class="text-gray-600 mb-4">Connect with qualified teachers in various subjects.</p>
            <NuxtLink 
              to="/teachers" 
              class="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
            >
              Browse Teachers
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-indigo-600 text-2xl mb-4">📅</div>
            <h3 class="text-xl font-semibold mb-2">Book Sessions</h3>
            <p class="text-gray-600 mb-4">Schedule and book one-on-one sessions with teachers.</p>
            <NuxtLink 
              to="/teachers" 
              class="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
            >
              Find Available Sessions
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-indigo-600 text-2xl mb-4">💬</div>
            <h3 class="text-xl font-semibold mb-2">Secure Messaging</h3>
            <p class="text-gray-600 mb-4">Communicate directly with teachers through our platform.</p>
            <NuxtLink 
              to="/messages" 
              class="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
            >
              View Messages
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">For Students</h2>
            <p class="text-lg text-gray-600 mb-6">
              Find the perfect teacher to help you excel in your studies. Browse by subject, check reviews, and book sessions at times that work for you.
            </p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Access to qualified teachers in various subjects</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Flexible scheduling to fit your timetable</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Secure payment system</span>
              </li>
            </ul>
            <NuxtLink 
              to="/register" 
              class="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Register as a Student
            </NuxtLink>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">For Teachers</h2>
            <p class="text-lg text-gray-600 mb-6">
              Share your knowledge and earn money by teaching students in your area of expertise. Set your own schedule and rates.
            </p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Create your professional profile</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Set your own availability and rates</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Receive payments securely through our platform</span>
              </li>
            </ul>
            <button 
              class="inline-flex items-center px-5 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Apply to Teach
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Home page logic can go here
</script>
