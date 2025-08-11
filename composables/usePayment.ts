import { ref, computed } from 'vue'

interface PaymentIntent {
  clientSecret: string
}

export const usePayment = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const clientSecret = ref<string | null>(null)
  const isPaymentComplete = ref(false)
  const stripe = ref<any>(null)
  const elements = ref<any>(null)

  // Initialiser Stripe
  const initStripe = async () => {
    // S'assurer que Stripe est chargé globalement
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.async = true
      document.body.appendChild(script)
      
      await new Promise((resolve) => {
        script.onload = resolve
      })
    }
    
    // Initialiser Stripe avec la clé publique
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy_key_replace_with_your_actual_key'
    stripe.value = window.Stripe(publishableKey)
  }

  // Créer une intention de paiement pour une réservation
  const createPaymentIntent = async (bookingId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la création du paiement')
      }
      
      const data = await response.json()
      clientSecret.value = data.clientSecret
      
      return data.clientSecret
    } catch (err: any) {
      console.error('Error creating payment intent:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Initialiser les éléments de paiement
  const initPaymentElement = async (elementId: string, options = {}) => {
    if (!stripe.value) {
      await initStripe()
    }
    
    if (!clientSecret.value) {
      error.value = 'Client secret is required to initialize payment element'
      return null
    }
    
    elements.value = stripe.value.elements({
      clientSecret: clientSecret.value,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    })
    
    const paymentElement = elements.value.create('payment', options)
    paymentElement.mount(`#${elementId}`)
    
    return paymentElement
  }

  // Confirmer le paiement
  const confirmPayment = async (returnUrl: string) => {
    try {
      loading.value = true
      error.value = null
      
      if (!stripe.value || !elements.value) {
        throw new Error('Stripe has not been initialized')
      }
      
      const result = await stripe.value.confirmPayment({
        elements: elements.value,
        confirmParams: {
          return_url: returnUrl
        }
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      isPaymentComplete.value = true
      return true
    } catch (err: any) {
      console.error('Error confirming payment:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Vérifier le statut du paiement après redirection
  const checkPaymentStatus = async () => {
    try {
      if (!stripe.value) {
        await initStripe()
      }
      
      const urlParams = new URLSearchParams(window.location.search)
      const paymentIntentId = urlParams.get('payment_intent')
      const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret')
      const redirectStatus = urlParams.get('redirect_status')
      
      if (!paymentIntentId || !paymentIntentClientSecret) {
        return null
      }
      
      if (redirectStatus === 'succeeded') {
        isPaymentComplete.value = true
        return { status: 'succeeded', paymentIntentId }
      }
      
      const result = await stripe.value.retrievePaymentIntent(paymentIntentClientSecret)
      
      if (result.paymentIntent) {
        if (result.paymentIntent.status === 'succeeded') {
          isPaymentComplete.value = true
        }
        
        return {
          status: result.paymentIntent.status,
          paymentIntentId: result.paymentIntent.id
        }
      }
      
      return null
    } catch (err: any) {
      console.error('Error checking payment status:', err)
      error.value = err.message
      return null
    }
  }

  return {
    loading,
    error,
    clientSecret,
    isPaymentComplete,
    initStripe,
    createPaymentIntent,
    initPaymentElement,
    confirmPayment,
    checkPaymentStatus
  }
}