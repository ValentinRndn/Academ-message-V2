import { ref } from 'vue'

interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  show: boolean
}

const toasts = ref<ToastNotification[]>([])
let toastId = 0

export const useToast = () => {
  const addToast = (toast: Omit<ToastNotification, 'id' | 'show'>) => {
    const id = `toast-${++toastId}`
    const newToast: ToastNotification = {
      ...toast,
      id,
      show: true,
      duration: toast.duration || 5000
    }
    
    toasts.value.push(newToast)
    
    // Auto-remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].show = false
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = toasts.value.findIndex(toast => toast.id === id)
        if (currentIndex > -1) {
          toasts.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  }
  
  const showSuccess = (title: string, message?: string, duration?: number) => {
    return addToast({ type: 'success', title, message, duration })
  }
  
  const showError = (title: string, message?: string, duration?: number) => {
    return addToast({ type: 'error', title, message, duration })
  }
  
  const showInfo = (title: string, message?: string, duration?: number) => {
    return addToast({ type: 'info', title, message, duration })
  }
  
  const showWarning = (title: string, message?: string, duration?: number) => {
    return addToast({ type: 'warning', title, message, duration })
  }
  
  const clearAll = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    clearAll
  }
}
