// Composable pour gérer les notifications globales
const notifications = ref([])

export const useNotifications = () => {
  
  // Ajouter une notification de succès
  const showSuccess = (title, message, duration = 5000) => {
    const id = Date.now()
    notifications.value.push({
      id,
      type: 'success',
      title,
      message,
      duration,
      show: true
    })
    
    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  // Ajouter une notification d'erreur
  const showError = (title, message, duration = 5000) => {
    const id = Date.now()
    notifications.value.push({
      id,
      type: 'error',
      title,
      message,
      duration,
      show: true
    })
    
    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  // Ajouter une notification d'information
  const showInfo = (title, message, duration = 5000) => {
    const id = Date.now()
    notifications.value.push({
      id,
      type: 'info',
      title,
      message,
      duration,
      show: true
    })
    
    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  // Supprimer une notification
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  // Fermer toutes les notifications
  const clearAll = () => {
    notifications.value = []
  }
  
  return {
    notifications: readonly(notifications),
    showSuccess,
    showError,
    showInfo,
    removeNotification,
    clearAll
  }
}
