<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Finaliser votre réservation</h1>
        <p class="text-gray-600 mt-2">Confirmez et payez votre cours</p>
      </div>

      <div v-if="loading && !booking" class="text-center py-12">
        <div class="dots-loader"><div></div><div></div><div></div></div>
        <p class="text-gray-600 mt-4">Chargement de votre réservation...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/teachers" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Retour aux professeurs
        </NuxtLink>
      </div>

      <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Résumé de la réservation -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Détails de votre cours</h2>
            
            <div class="space-y-4">
              <!-- Professeur -->
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span class="text-indigo-600 font-medium text-lg">
                    {{ booking.teacherId?.firstName?.charAt(0) }}{{ booking.teacherId?.lastName?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ booking.teacherId?.firstName }} {{ booking.teacherId?.lastName }}
                  </p>
                  <p class="text-sm text-gray-600">Professeur certifié</p>
                </div>
              </div>

              <!-- Matière -->
              <div class="flex items-center justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Matière</span>
                <span class="font-medium text-gray-900">{{ booking.subjectId?.name }}</span>
              </div>

              <!-- Date et heure -->
              <div class="flex items-center justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Date et heure</span>
                <div class="text-right">
                  <p class="font-medium text-gray-900">{{ formatDate(booking.startTime) }}</p>
                  <p class="text-sm text-gray-600">{{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</p>
                </div>
              </div>

              <!-- Durée -->
              <div class="flex items-center justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Durée</span>
                <span class="font-medium text-gray-900">{{ booking.duration }} minutes</span>
              </div>

              <!-- Notes -->
              <div v-if="booking.studentNotes" class="py-2">
                <span class="text-gray-600 block mb-2">Vos notes</span>
                <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ booking.studentNotes }}</p>
              </div>
            </div>
          </div>

          <!-- Formulaire de paiement -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h2>
            
            <div v-if="!stripeLoaded" class="text-center py-8">
              <div class="dots-loader"><div></div><div></div><div></div></div>
              <p class="text-gray-600 mt-4">Chargement du système de paiement...</p>
            </div>

            <div v-else-if="paymentError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-red-700">{{ paymentError }}</p>
              </div>
            </div>

            <form @submit.prevent="handlePayment" v-else>
              <!-- Element Stripe -->
              <div id="card-element" class="p-3 border border-gray-300 rounded-lg mb-4">
                <!-- Stripe Elements sera injecté ici -->
              </div>

              <button
                type="submit"
                :disabled="paymentLoading || !clientSecret"
                class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg v-if="paymentLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ paymentLoading ? 'Traitement...' : `Payer ${booking.totalAmount}€` }}
              </button>
            </form>
          </div>
        </div>

        <!-- Résumé des coûts -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Cours ({{ formatDuration(booking.duration) }})</span>
                <span>{{ booking.teacherAmount }}€</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Commission plateforme</span>
                <span>{{ booking.platformCommission }}€</span>
              </div>
              
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{{ booking.totalAmount }}€</span>
                </div>
              </div>
            </div>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-blue-900">Paiement sécurisé</p>
                  <p class="text-xs text-blue-700 mt-1">Vos informations sont protégées par Stripe</p>
                </div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-green-50 rounded-lg">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-green-900">Annulation gratuite</p>
                  <p class="text-xs text-green-700 mt-1">Jusqu'à 24h avant le cours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '~/composables/useToast';

const route = useRoute();
const router = useRouter();
const { showSuccess, showError } = useToast();

// État
const booking = ref(null);
const loading = ref(true);
const error = ref(null);
const stripeLoaded = ref(false);
const paymentLoading = ref(false);
const paymentError = ref(null);
const clientSecret = ref(null);

// Variables Stripe
let stripe = null;
let elements = null;
let cardElement = null;

// Charger la réservation
const loadBooking = async () => {
  try {
    const bookingId = route.query.booking;
    if (!bookingId) {
      throw new Error('ID de réservation manquant');
    }

    const response = await $fetch(`/api/bookings/${bookingId}`, {
      credentials: 'include'
    });

    booking.value = response.booking;
    
    // Créer l'intention de paiement
    await createPaymentIntent();
  } catch (err) {
    console.error('Erreur lors du chargement de la réservation:', err);
    error.value = err.data?.message || err.message || 'Impossible de charger la réservation';
  } finally {
    loading.value = false;
  }
};

// Créer l'intention de paiement
const createPaymentIntent = async () => {
  try {
    const response = await $fetch('/api/payments/create-intent', {
      method: 'POST',
      body: { bookingId: booking.value._id },
      credentials: 'include'
    });

    clientSecret.value = response.clientSecret;
    await initializeStripe();
  } catch (err) {
    console.error('Erreur lors de la création de l\'intention de paiement:', err);
    paymentError.value = err.data?.message || 'Impossible d\'initialiser le paiement';
  }
};

// Initialiser Stripe
const initializeStripe = async () => {
  try {
    // Charger Stripe.js
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Clé publique Stripe (remplacer par votre vraie clé)
    const publishableKey = 'pk_test_dummy_key_replace_with_your_actual_key';
    stripe = window.Stripe(publishableKey);

    // Créer les éléments
    elements = stripe.elements();
    
    await nextTick();

    // Créer l'élément carte
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });

    // Monter l'élément
    cardElement.mount('#card-element');

    stripeLoaded.value = true;
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de Stripe:', err);
    paymentError.value = 'Impossible de charger le système de paiement';
  }
};

// Traiter le paiement
const handlePayment = async () => {
  if (!stripe || !cardElement || !clientSecret.value) return;

  paymentLoading.value = true;
  paymentError.value = null;

  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      paymentError.value = error.message;
    } else if (paymentIntent.status === 'succeeded') {
      showSuccess(
        'Paiement réussi !',
        'Votre cours a été confirmé. Vous recevrez bientôt un email de confirmation.',
        5000
      );
      
      // Rediriger vers le dashboard ou la page de confirmation
      await router.push('/dashboard?booking=confirmed');
    }
  } catch (err) {
    console.error('Erreur lors du paiement:', err);
    paymentError.value = 'Une erreur est survenue lors du paiement';
  } finally {
    paymentLoading.value = false;
  }
};

// Fonctions utilitaires
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}min`;
  }
};

// Lifecycle
onMounted(() => {
  loadBooking();
});
</script>

<style scoped>
.dots-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}
.dots-loader div {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: #4f46e5;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}
.dots-loader div:nth-child(1) {
  animation-delay: -0.32s;
}
.dots-loader div:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
