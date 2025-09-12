<template>
  <div class="fixed top-4 right-4 z-50 space-y-4">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item p-4 rounded-lg shadow-lg max-w-sm"
        :class="{
          'bg-green-100 border-l-4 border-green-500': notification.type === 'success',
          'bg-red-100 border-l-4 border-red-500': notification.type === 'error',
          'bg-yellow-100 border-l-4 border-yellow-500': notification.type === 'warning',
          'bg-purple-100 border-l-4 border-purple-500': notification.type === 'info'
        }"
      >
        <div class="flex items-start">
          <div class="flex-1">
            <h3 class="font-semibold" :class="{
              'text-green-800': notification.type === 'success',
              'text-red-800': notification.type === 'error',
              'text-yellow-800': notification.type === 'warning',
              'text-purple-800': notification.type === 'info'
            }">
              {{ notification.title }}
            </h3>
            <p class="text-sm mt-1" :class="{
              'text-green-700': notification.type === 'success',
              'text-red-700': notification.type === 'error',
              'text-yellow-700': notification.type === 'warning',
              'text-purple-700': notification.type === 'info'
            }">
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="hideNotification(notification.id)"
            class="ml-4 text-gray-400 hover:text-gray-600"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotifications } from '~/composables/useNotifications';

const { notifications, hideNotification } = useNotifications();
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>