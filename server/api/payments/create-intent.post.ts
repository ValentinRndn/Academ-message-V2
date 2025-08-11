import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../utils/jwt'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_replace_with_your_actual_key')

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const authHeader = getHeader(event, 'authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    
    const user = verifyToken(token)
    
    // Récupérer les données du corps de la requête
    const body = await readBody(event)
    const { bookingId } = body
    
    if (!bookingId) {
      return createError({
        statusCode: 400,
        message: 'bookingId is required'
      })
    }
    
    // Récupérer les informations de réservation
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
    
    if (!booking) {
      return createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }
    
    // Vérifier que l'utilisateur est bien l'étudiant qui a fait la réservation
    if (booking.studentId !== user.id) {
      return createError({
        statusCode: 403,
        message: 'You are not authorized to pay for this booking'
      })
    }
    
    // Vérifier que la réservation est en statut 'pending'
    if (booking.status !== 'pending') {
      return createError({
        statusCode: 400,
        message: `Cannot pay for a booking with status ${booking.status}`
      })
    }
    
    // Vérifier que la réservation n'est pas déjà payée
    if (booking.paymentStatus === 'paid') {
      return createError({
        statusCode: 400,
        message: 'This booking is already paid'
      })
    }
    
    // Convertir le montant en centimes pour Stripe
    const amountInCents = Math.round(booking.amount * 100)
    
    // Créer une intent de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: booking.currency.toLowerCase(),
      metadata: {
        bookingId: booking.id,
        teacherId: booking.teacherId,
        studentId: booking.studentId
      },
      receipt_email: booking.student.email,
      description: `Réservation de cours avec ${booking.teacher.firstName} ${booking.teacher.lastName}`
    })
    
    // Mettre à jour la réservation avec l'ID de l'intent de paiement
    await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        paymentIntentId: paymentIntent.id
      }
    })
    
    return {
      clientSecret: paymentIntent.client_secret
    }
    
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not create payment intent'
    })
  }
})