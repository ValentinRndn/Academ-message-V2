<template>
  <div class="relative">
    <!-- Bouton de notifications -->
    <button
      @click="togglePanel"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2V2h3v2.2q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-4-5h8v-7q0-1.65-1.175-2.825T12 6T9.175 7.175T8 10z"/></svg>
      
      <!-- Badge de notifications non lues -->
      <span
        v-if="hasUnread"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Panel des notifications -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <!-- En-tête -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="hasUnread"
            @click="markAllAsRead"
            class="text-sm text-purple-600 hover:text-purple-800"
          >
            Tout marquer comme lu
          </button>
          <button
            @click="clearAll"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Effacer tout
          </button>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="sortedNotifications.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Aucune notification</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="notification in sortedNotifications"
            :key="notification.id"
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'bg-purple-50': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3">
              <!-- Icône selon le type -->
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getNotificationIconClass(notification.type)
                  ]"
                >
                  <component :is="getNotificationIcon(notification.type)" class="w-4 h-4 text-white" />
                </div>
              </div>

              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                    <button
                      @click.stop="removeNotification(notification.id)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{ notification.message }}
                </p>
              </div>

              <!-- Indicateur de non lu -->
              <div v-if="!notification.read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pied de page -->
      <div class="p-4 border-t border-gray-200">
        <button
          @click="viewAllNotifications"
          class="w-full text-center text-sm text-purple-600 hover:text-purple-800"
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer le panel -->
    <div
      v-if="isOpen"
      @click="closePanel"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const { 
  notifications, 
  unreadCount, 
  hasUnread, 
  sortedNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll
} = useNotifications();

// État local
const isOpen = ref(false);

// Méthodes
const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

const closePanel = () => {
  isOpen.value = false;
};

const handleNotificationClick = (notification) => {
  // Marquer comme lu
  if (!notification.read) {
    markAsRead(notification.id);
  }

  // Gérer l'action selon le type
  switch (notification.action) {
    case 'view':
      if (notification.data) {
        // Naviguer vers la page appropriée
        navigateTo(`/teacher/schedule?booking=${notification.data._id}`);
      }
      break;
    default:
      console.log('Notification clicked:', notification);
  }

  closePanel();
};

const viewAllNotifications = () => {
  // TODO: Naviguer vers une page dédiée aux notifications
  console.log('View all notifications');
  closePanel();
};

const getNotificationIcon = (type) => {
  const icons = {
    booking: {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
    },
    cancellation: {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>'
    },
    confirmation: {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
    },
    reminder: {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    }
  };
  
  return icons[type] || icons.booking;
};

const getNotificationIconClass = (type) => {
  const classes = {
    booking: 'bg-purple-500',
    cancellation: 'bg-red-500',
    confirmation: 'bg-green-500',
    reminder: 'bg-yellow-500'
  };
  
  return classes[type] || 'bg-gray-500';
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return new Date(date).toLocaleDateString('fr-FR');
};
</script>
