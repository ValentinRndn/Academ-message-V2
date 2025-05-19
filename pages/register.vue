<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="animate-float-slow absolute top-24 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40"></div>
      <div class="animate-float absolute -top-10 right-10 w-80 h-80 rounded-full bg-indigo-200 opacity-30"></div>
      <div class="animate-float-reverse absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-purple-100 opacity-40"></div>
    </div>
    
    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo/branding -->
      <div class="text-center animate-fade-in">
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          <span class="text-indigo-600">Academ</span> Message
        </h2>
        <h1 class="mt-2 text-center text-xl font-bold text-gray-700">Create your account</h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join our academic community and connect with expert teachers
        </p>
      </div>
      
      <!-- Registration card with animation -->
      <div class="animate-fade-in-up bg-white py-8 px-10 shadow-xl rounded-xl border border-gray-100">
        <!-- Registration steps progress indicator -->
        <!-- <div class="mb-8">
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">1</div>
              <div class="text-xs mt-1 text-indigo-600 font-medium">Account</div>
            </div>
            <div class="flex-1 h-1 mx-2 bg-indigo-200"></div>
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">2</div>
              <div class="text-xs mt-1 text-gray-500">Verification</div>
            </div>
            <div class="flex-1 h-1 mx-2 bg-gray-200"></div>
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">3</div>
              <div class="text-xs mt-1 text-gray-500">Complete</div>
            </div>
          </div>
        </div> -->
      
        <!-- Error alert if needed -->
        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md animate-fade-in">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div class="relative">
                <input 
                  id="firstName" 
                  v-model="firstName" 
                  type="text" 
                  required 
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="John"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3" v-if="firstName">
                  <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div class="relative">
                <input 
                  id="lastName" 
                  v-model="lastName" 
                  type="text" 
                  required 
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Doe"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3" v-if="lastName">
                  <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Academic Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required 
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="your.email@university.edu"
                :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': email && !isValidEmail}"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg v-if="email && isValidEmail" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="email && !isValidEmail" class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p class="mt-1.5 text-xs text-gray-500 flex items-center">
              <svg class="h-3 w-3 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Must be a valid academic email address
            </p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                required 
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="••••••••"
                :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': password && !isValidPassword}"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg v-if="password && isValidPassword" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="password && !isValidPassword" class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <!-- Password strength indicator -->
            <div class="mt-2" v-if="password">
              <div class="flex space-x-1 mb-1.5">
                <div class="flex-1 h-1 rounded-full" :class="password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'"></div>
                <div class="flex-1 h-1 rounded-full" :class="/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'"></div>
                <div class="flex-1 h-1 rounded-full" :class="/[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-gray-300'"></div>
              </div>
              <p class="text-xs text-gray-500 flex items-center">
                <svg class="h-3 w-3 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                Minimum 8 characters with at least one number and one special character
              </p>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="confirmPassword" 
                v-model="confirmPassword" 
                type="password" 
                required 
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="••••••••"
                :class="{'border-red-300 focus:ring-red-500 focus:border-red-500': confirmPassword && !passwordsMatch}"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg v-if="confirmPassword && passwordsMatch" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="confirmPassword && !passwordsMatch" class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p v-if="confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-500">Passwords do not match</p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input 
                  id="terms" 
                  v-model="agreeToTerms" 
                  type="checkbox" 
                  required
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">I agree to the</label>
                <p class="text-gray-500">
                  <a href="#" class="text-indigo-600 hover:text-indigo-500 hover:underline transition duration-150">Terms of Service</a>
                  and
                  <a href="#" class="text-indigo-600 hover:text-indigo-500 hover:underline transition duration-150">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition duration-150 transform hover:scale-[1.02]"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Create Account</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating your account...
              </span>
            </button>
          </div>
        </form>
      </div>
      
      <!-- Login link -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-150">
            Log in here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const isValidEmail = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email.value);
});

const isValidPassword = computed(() => {
  // At least 8 characters, one number, one special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password.value);
});

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value;
});

const handleRegister = async () => {
  try {
    // Validate form
    if (!isValidEmail.value) {
      errorMessage.value = 'Please enter a valid email address';
      return;
    }
    
    if (!isValidPassword.value) {
      errorMessage.value = 'Password must be at least 8 characters with at least one number and one special character';
      return;
    }
    
    if (!passwordsMatch.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    isLoading.value = true;
    errorMessage.value = '';
    
    // In a real app, you would call your registration API here
    // For now, we'll simulate a successful registration after a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful registration
    console.log('Registration successful', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value
    });
    
    // Redirect to login page after successful registration
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message || 'Failed to register. Please try again.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};
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
  animation: fade-in 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>