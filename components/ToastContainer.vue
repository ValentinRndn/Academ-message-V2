<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] space-y-3">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'max-w-lg min-w-[300px] w-full bg-white shadow-2xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-gray-200 transform transition-all duration-300',
            toast.show ? 'animate-toast-in scale-100' : 'animate-toast-out scale-95'
          ]"
        >
          <div class="p-5">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon 
                  v-if="toast.type === 'success'" 
                  class="h-7 w-7 text-green-500" 
                  aria-hidden="true" 
                />
                <XCircleIcon 
                  v-else-if="toast.type === 'error'" 
                  class="h-7 w-7 text-red-500" 
                  aria-hidden="true" 
                />
                <InformationCircleIcon 
                  v-else-if="toast.type === 'info'" 
                  class="h-7 w-7 text-blue-500" 
                  aria-hidden="true" 
                />
                <ExclamationTriangleIcon 
                  v-else-if="toast.type === 'warning'" 
                  class="h-7 w-7 text-yellow-500" 
                  aria-hidden="true" 
                />
              </div>
              <div class="ml-4 w-0 flex-1 pt-0.5">
                <p class="text-base font-semibold text-gray-900">{{ toast.title }}</p>
                <p v-if="toast.message" class="mt-2 text-sm text-gray-600 leading-relaxed">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  class="bg-white rounded-lg inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors p-1"
                  @click="removeToast(toast.id)"
                >
                  <span class="sr-only">Fermer</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

// Icons (using simple SVG instead of Heroicons for simplicity)
const CheckCircleIcon = {
  template: `
    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const XCircleIcon = {
  template: `
    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `
}

const InformationCircleIcon = {
  template: `
    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `
}

const ExclamationTriangleIcon = {
  template: `
    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  `
}

const XMarkIcon = {
  template: `
    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
}

const { toasts, removeToast } = useToast()
</script>

<style scoped>
@keyframes toast-in {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
}

.animate-toast-in {
  animation: toast-in 0.4s ease-out;
}

.animate-toast-out {
  animation: toast-out 0.3s ease-in;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.4s ease;
}
</style>
