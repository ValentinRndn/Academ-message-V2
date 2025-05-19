<template>
  <div class="landing-page bg-gradient-to-b from-indigo-50 to-white">
    <!-- Hero Section with Animation -->
    <section class="min-h-screen relative overflow-hidden flex items-center">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="animate-float-slow absolute top-24 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40"></div>
        <div class="animate-float absolute -top-10 right-10 w-80 h-80 rounded-full bg-indigo-200 opacity-30"></div>
        <div class="animate-float-reverse absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-purple-100 opacity-40"></div>
      </div>
      
      <div class="max-w-6xl mx-auto px-4 py-20 relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="animate-fade-in-up text-center md:text-left">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span class="text-indigo-600">Connect</span> and <span class="text-indigo-600">Learn</span> with Top Academic Experts
            </h1>
            <p class="text-xl text-gray-600 mb-8 md:pr-10">
              Academ Message is a secure platform connecting students with qualified teachers for personalized academic support.
            </p>
            <div class="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0  gap-4">
              <NuxtLink 
                to="/register" 
                class="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
              <NuxtLink 
                to="/login" 
                class="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <span>Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Hero Image/Illustration -->
          <div class="animate-fade-in order-first md:order-last">
            <div class="relative mx-auto max-w-md">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-3xl transform rotate-3 scale-105 opacity-30 blur-xl"></div>
              <div class="relative bg-white p-6 rounded-3xl shadow-xl transform hover:scale-102 transition-transform">
                <div class="flex items-center p-3 border-b border-gray-100 mb-4">
                  <div class="flex space-x-2">
                    <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div class="text-sm text-gray-500 mx-auto">Academ Message</div>
                </div>
                
                <!-- Chat interface mockup -->
                <div class="space-y-3">
                  <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 flex-shrink-0">T</div>
                    <div class="bg-gray-100 rounded-lg rounded-tl-none p-3 text-sm max-w-xs">
                      <p>Hello! I'm available to help with your calculus questions today.</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-end">
                    <div class="bg-indigo-100 rounded-lg rounded-tr-none p-3 text-sm max-w-xs">
                      <p>Great! I'm struggling with derivatives. Can we schedule a session?</p>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3 flex-shrink-0">S</div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 flex-shrink-0">T</div>
                    <div class="bg-gray-100 rounded-lg rounded-tl-none p-3 text-sm max-w-xs">
                      <p>Absolutely! I have time tomorrow at 3pm. Does that work for you?</p>
                    </div>
                  </div>
                </div>
                
                <!-- Message input mockup -->
                <div class="mt-4 flex">
                  <input type="text" placeholder="Type a message..." class="flex-1 bg-gray-100 rounded-l-lg px-4 py-2 text-sm focus:outline-none">
                  <button class="bg-indigo-600 text-white px-4 rounded-r-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-white" id="how-it-works">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How Academ Message Works</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy to connect with academic experts and get the help you need
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold mb-6 mx-auto">1</div>
            <h3 class="text-xl font-semibold mb-4 text-center">Create Your Account</h3>
            <p class="text-gray-600 text-center mb-6">Sign up as a student or log in as a verified teacher to access all features.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Step 2 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 md:translate-y-4">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold mb-6 mx-auto">2</div>
            <h3 class="text-xl font-semibold mb-4 text-center">Find the Right Match</h3>
            <p class="text-gray-600 text-center mb-6">Browse profiles or post your learning needs to find the perfect teacher.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Step 3 -->
          <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold mb-6 mx-auto">3</div>
            <h3 class="text-xl font-semibold mb-4 text-center">Connect and Learn</h3>
            <p class="text-gray-600 text-center mb-6">Message, schedule sessions, and collaborate through our secure platform.</p>
            <div class="flex justify-center">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with animation -->
    <section class="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Academ Message</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <div class="text-indigo-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-full bg-indigo-100 p-4 inline-flex">👨‍🏫</span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Expert Teachers</h3>
            <p class="text-gray-600 text-center">All our teachers are verified professionals with expertise in their fields.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/teachers" 
                class="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group"
              >
                Browse Teachers
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <div class="text-indigo-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-full bg-indigo-100 p-4 inline-flex">📅</span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Flexible Scheduling</h3>
            <p class="text-gray-600 text-center">Book sessions that fit your schedule and learning pace.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/teachers" 
                class="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group"
              >
                Find Available Sessions
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <div class="text-indigo-600 text-4xl mb-6 flex justify-center">
              <span class="rounded-full bg-indigo-100 p-4 inline-flex">💬</span>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-center">Secure Platform</h3>
            <p class="text-gray-600 text-center">All communications and transactions are secure and private.</p>
            <div class="mt-6 text-center">
              <NuxtLink 
                to="/messages" 
                class="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group"
              >
                View Messages
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Student & Teacher Section -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-stretch">
          <!-- Student Card -->
          <div class="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-full text-3xl shadow-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">For Students</h2>
              <p class="text-lg text-gray-600 mb-6">
                Get personalized academic support from qualified teachers
              </p>
            </div>
            
            <div class="flex-grow">
              <ul class="space-y-4 mb-8">
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Access to verified teachers in various academic subjects</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Schedule one-on-one sessions at times that work for you</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Communicate and exchange files through our secure platform</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Pay securely through our integrated payment system</span>
                </li>
              </ul>
            </div>
            
            <div class="text-center mt-auto">
              <NuxtLink 
                to="/register" 
                class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                Register as a Student
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Teacher Card -->
          <div class="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 flex flex-col">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-purple-600 text-white rounded-full text-3xl shadow-md mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">For Teachers</h2>
              <p class="text-lg text-gray-600 mb-6">
                Share your expertise and help students succeed
              </p>
            </div>
            
            <div class="flex-grow">
              <ul class="space-y-4 mb-8">
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Create a professional profile showcasing your expertise and qualifications</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Set your own availability and hourly rates</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Connect with students who need your specific expertise</span>
                </li>
                <li class="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Receive payments directly and securely through our platform</span>
                </li>
              </ul>
            </div>
            
            <div class="text-center mt-auto">
              <NuxtLink 
                to="/login" 
                class="inline-flex items-center justify-center px-8 py-4 border border-purple-600 text-lg font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                Login as a Teacher
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Call to Action -->
    <section class="py-20 bg-indigo-600 text-white">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p class="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
          Join thousands of students and teachers already using Academ Message to achieve academic success.
        </p>
        <div class="flex flex-row sm:flex-row justify-center gap-4  w-fit mx-auto">
          <NuxtLink 
            to="/register" 
            class="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <span>Create Account</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-indigo-700 transform hover:scale-105 transition-all flex items-center justify-center"
          >
            <span>Learn More</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Academ Message</h3>
            <p class="text-gray-400 mb-4">Connecting students with qualified teachers for personalized academic support.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Links</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-gray-400 hover:text-white transition-colors">About Us</NuxtLink></li>
              <li><NuxtLink to="/teachers" class="text-gray-400 hover:text-white transition-colors">Find Teachers</NuxtLink></li>
              <li><NuxtLink to="/messages" class="text-gray-400 hover:text-white transition-colors">Messages</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/cookies" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Contact</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-400">support@academessage.com</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-gray-400">+33 (0)1 23 45 67 89</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Academ Message. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Home page logic can go here
</script>

<style scoped>
/* Animations */
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