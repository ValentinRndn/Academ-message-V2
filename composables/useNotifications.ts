import { ref, computed } from 'vue'

interface NotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

interface SubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export const useNotifications = () => {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const subscription = ref<PushSubscription | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Check notification support
  const checkSupport = () => {
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    if (isSupported.value) {
      permission.value = Notification.permission
    }
    return isSupported.value
  }

  // Request permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      error.value = 'Notifications are not supported by your browser'
      return false
    }

    try {
      loading.value = true
      error.value = null
      
      const result = await Notification.requestPermission()
      permission.value = result
      
      if (result === 'granted') {
        await subscribeToPush()
        return true
      } else {
        // Don't set error for denied permission - UI handles this state
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error requesting permission'
      return false
    } finally {
      loading.value = false
    }
  }

  // Subscribe to push notifications
  const subscribeToPush = async (): Promise<boolean> => {
    if (!isSupported.value || permission.value !== 'granted') {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Vérifier si déjà abonné
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        subscription.value = existingSubscription
        return true
      }

             // Créer un nouvel abonnement
       const newSubscription = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: urlBase64ToUint8Array(useRuntimeConfig().public.vapidPublicKey || '')
       })

      subscription.value = newSubscription

      // Envoyer l'abonnement au serveur
      await saveSubscription(newSubscription)
      
      return true
    } catch (err: any) {
      console.error('Subscription error:', err)
      error.value = err.message || 'Error subscribing to notifications'
      return false
    }
  }

  // Se désabonner des notifications
  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!subscription.value) {
      return true
    }

    try {
      await subscription.value.unsubscribe()
      subscription.value = null
      
      // Supprimer l'abonnement du serveur
      await deleteSubscription()
      
      return true
    } catch (err: any) {
      console.error('Unsubscription error:', err)
      error.value = err.message || 'Error unsubscribing'
      return false
    }
  }

  // Envoyer l'abonnement au serveur
  const saveSubscription = async (sub: PushSubscription) => {
    try {
      const subscriptionData: SubscriptionData = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, Array.from(sub.getKey('p256dh') || new Uint8Array()))),
          auth: btoa(String.fromCharCode.apply(null, Array.from(sub.getKey('auth') || new Uint8Array())))
        }
      }

      await $fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: subscriptionData,
        credentials: 'include'
      })
    } catch (err: any) {
      console.error('Error saving subscription:', err)
      throw err
    }
  }

  // Supprimer l'abonnement du serveur
  const deleteSubscription = async () => {
    try {
      await $fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err: any) {
      console.error('Error deleting subscription:', err)
      throw err
    }
  }

  // Afficher une notification locale
  const showLocalNotification = (data: NotificationData) => {
    if (!isSupported.value || permission.value !== 'granted') {
      return false
    }

    const options: NotificationOptions = {
      body: data.body,
      icon: data.icon || '/icon512_rounded.png',
      badge: data.badge || '/icon512_rounded.png',
      data: data.data,
      requireInteraction: true,
      actions: data.actions || [
        {
          action: 'view',
          title: 'View',
          icon: '/icon512_rounded.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon512_rounded.png'
        }
      ]
    }

    const notification = new Notification(data.title, options)
    
    notification.onclick = () => {
      window.focus()
      if (data.data?.url) {
        navigateTo(data.data.url)
      }
      notification.close()
    }

    return notification
  }

  // Initialiser les notifications
  const init = async () => {
    checkSupport()
    
    if (isSupported.value && permission.value === 'granted') {
      await subscribeToPush()
    }
  }

  // Convertir la clé VAPID
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Computed properties
  const canShowNotifications = computed(() => 
    isSupported.value && permission.value === 'granted'
  )

  const isSubscribed = computed(() => 
    subscription.value !== null
  )

  return {
    // State
    isSupported,
    permission,
    subscription,
    loading,
    error,
    
    // Computed
    canShowNotifications,
    isSubscribed,
    
    // Methods
    checkSupport,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showLocalNotification,
    init
  }
}
