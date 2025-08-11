import { ref, computed } from 'vue'
import { useSocket } from './useSocket'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  metadata: any
  createdAt: string
}

export const useNotifications = () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const socket = useSocket()

  // Initialiser la connexion socket pour les notifications en temps réel
  const initNotificationsSocket = () => {
    // Écouter les nouvelles notifications
    socket.onNotification((data: any) => {
      const newNotification = data.notification
      
      // Ajouter la notification à la liste
      notifications.value = [newNotification, ...notifications.value]
      
      // Incrémenter le compteur de notifications non lues
      if (!newNotification.read) {
        unreadCount.value++
      }
    })
  }

  // Récupérer les notifications
  const fetchNotifications = async (params: { page?: number, limit?: number, read?: boolean } = {}) => {
    try {
      loading.value = true
      error.value = null
      
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.read !== undefined) queryParams.append('read', params.read.toString())
      
      // Faire la requête API
      const response = await fetch(`/api/notifications?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la récupération des notifications')
      }
      
      const data = await response.json()
      
      // Mettre à jour les notifications et le compteur de notifications non lues
      notifications.value = data.notifications
      unreadCount.value = data.unreadCount
      
      return data
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Marquer une notification comme lue
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors du marquage de la notification comme lue')
      }
      
      // Mettre à jour l'état local
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      
      return true
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Marquer toutes les notifications comme lues
  const markAllNotificationsAsRead = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markAllAsRead: true })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors du marquage des notifications comme lues')
      }
      
      // Mettre à jour l'état local
      notifications.value.forEach(notification => {
        notification.read = true
      })
      unreadCount.value = 0
      
      return true
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Formater une date de notification
  const formatNotificationDate = (date: string): string => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "À l'instant"
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`
    
    return notificationDate.toLocaleDateString()
  }
  
  // Obtenir l'icône correspondant au type de notification
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'new_message':
        return 'message'
      case 'new_booking':
        return 'calendar-plus'
      case 'booking_confirmed':
        return 'calendar-check'
      case 'booking_cancelled':
        return 'calendar-times'
      case 'payment_received':
        return 'credit-card'
      case 'payment_failed':
        return 'exclamation-circle'
      case 'review_received':
        return 'star'
      default:
        return 'bell'
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    initNotificationsSocket,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    formatNotificationDate,
    getNotificationIcon
  }
}