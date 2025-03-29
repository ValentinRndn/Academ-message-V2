<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">Login to Academ Message</h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="your.email@university.edu"
        />
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
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input 
            id="remember-me" 
            v-model="rememberMe" 
            type="checkbox" 
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>
        
        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
        </div>
      </div>
      
      <div>
        <button 
          type="submit" 
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Register here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // In a real app, you would call your authentication API here
    // For now, we'll simulate a successful login after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    console.log('Login successful', {
      email: email.value,
      rememberMe: rememberMe.value
    });
    
    // Redirect to messages page after successful login
    router.push('/messages');
  } catch (error) {
    errorMessage.value = error.message || 'Failed to login. Please try again.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
