import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_replace_with_your_actual_key')
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_key_replace_with_your_actual_key'

export default defineEventHandler(async (event) => {
  try {
    const body = await readRawBody(event)
    const signature = getHeader(event, 'stripe-signature')
    
    if (!body || !signature) {
      return createError({
        statusCode: 400,
        message: 'Missing body or signature'
      })
    }
    
    let stripeEvent
    
    try {
      // Vérifier la signature
      stripeEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return createError({
        statusCode: 400,
        message: `Webhook signature verification failed: ${err.message}`
      })
    }
    
    // Traitement des événements
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(stripeEvent.data.object)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(stripeEvent.data.object)
        break
    }
    
    return { received: true }
    
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not process webhook'
    })
  }
})

// Gestion du succès du paiement
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata
  
  if (!bookingId) {
    console.error('No bookingId in metadata')
    return
  }
  
  // Mettre à jour la réservation
  await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDate: new Date()
    }
  })
  
  // Récupérer les informations de la réservation
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  })
  
  if (!booking) return
  
  // Créer une notification pour l'enseignant
  await prisma.notification.create({
    data: {
      userId: booking.teacherId,
      type: 'booking_confirmed',
      message: `Réservation confirmée avec ${booking.student.firstName} ${booking.student.lastName}`,
      metadata: {
        bookingId,
        studentId: booking.studentId,
        studentName: `${booking.student.firstName} ${booking.student.lastName}`
      },
      read: false
    }
  })
  
  // Créer une notification pour l'étudiant
  await prisma.notification.create({
    data: {
      userId: booking.studentId,
      type: 'booking_confirmed',
      message: `Votre réservation avec ${booking.teacher.firstName} ${booking.teacher.lastName} est confirmée`,
      metadata: {
        bookingId,
        teacherId: booking.teacherId,
        teacherName: `${booking.teacher.firstName} ${booking.teacher.lastName}`
      },
      read: false
    }
  })
}

// Gestion de l'échec du paiement
async function handlePaymentIntentFailed(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata
  
  if (!bookingId) {
    console.error('No bookingId in metadata')
    return
  }
  
  // Récupérer les informations de la réservation
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      student: {
        select: {
          id: true
        }
      }
    }
  })
  
  if (!booking) return
  
  // Mettre à jour le statut du paiement
  await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      paymentStatus: 'failed'
    }
  })
  
  // Créer une notification pour l'étudiant
  await prisma.notification.create({
    data: {
      userId: booking.studentId,
      type: 'payment_failed',
      message: 'Votre paiement a échoué. Veuillez réessayer.',
      metadata: {
        bookingId,
        errorMessage: paymentIntent.last_payment_error?.message || 'Unknown error'
      },
      read: false
    }
  })
}