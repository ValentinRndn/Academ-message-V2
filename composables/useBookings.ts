import { ref } from 'vue'

interface Booking {
  id: string
  teacherId: string
  studentId: string
  availabilityId: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  amount: number
  currency: string
}

interface BookingFormData {
  teacherId: string
  availabilityId: string
  startTime: string
  endTime: string
}

export const useBookings = () => {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer toutes les réservations de l'utilisateur courant
  const fetchBookings = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la récupération des réservations')
      }

      const data = await response.json()
      bookings.value = data.bookings

      return data.bookings
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Créer une nouvelle réservation
  const createBooking = async (bookingData: BookingFormData) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la création de la réservation')
      }

      const data = await response.json()
      
      // Rafraîchir la liste des réservations
      await fetchBookings()

      return data.booking
    } catch (err: any) {
      console.error('Error creating booking:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Annuler une réservation
  const cancelBooking = async (bookingId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de l\'annulation de la réservation')
      }

      const data = await response.json()
      
      // Rafraîchir la liste des réservations
      await fetchBookings()

      return data.success
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Soumettre un avis pour une réservation terminée
  const submitReview = async (bookingId: string, rating: number, comment: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la soumission de l\'avis')
      }

      const data = await response.json()
      return data.review
    } catch (err: any) {
      console.error('Error submitting review:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    submitReview
  }
}