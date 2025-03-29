<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</h1>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            id="firstName" 
            v-model="firstName" 
            type="text" 
            required 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            id="lastName" 
            v-model="lastName" 
            type="text" 
            required 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Academic Email</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="your.email@university.edu"
        />
        <p class="mt-1 text-xs text-gray-500">Must be a valid academic email address</p>
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
        <p class="mt-1 text-xs text-gray-500">Minimum 8 characters with at least one number and one special character</p>
      </div>
      
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input 
          id="confirmPassword" 
          v-model="confirmPassword" 
          type="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>
      
      <div class="flex items-center">
        <input 
          id="terms" 
          v-model="agreeToTerms" 
          type="checkbox" 
          required
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-700">
          I agree to the 
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>
          and
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </label>
      </div>
      
      <div>
        <button 
          type="submit" 
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </button>
      </div>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Login here
        </NuxtLink>
      </p>
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
