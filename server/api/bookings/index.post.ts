import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_votreclédetest', {
  apiVersion: '2025-02-24.acacia' as any
})

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  availabilityId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  paymentIntentId: string | null;
  paymentStatus: string | null;
  amount: number;
  currency: string;
  student: User;
  teacher: User;
}

export default defineEventHandler(async (event) => {
  try {
    // Get user from token
    const authHeader = event.node.req.headers.authorization
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    
    const user = verifyToken(token)
    
    // Get booking data from request body
    const { teacherId, availabilityId, startTime, endTime } = await readBody(event)
    
    if (!teacherId || !availabilityId || !startTime || !endTime) {
      throw createError({
        statusCode: 400,
        message: 'All booking details are required'
      })
    }
    
    // Check if teacher exists
    const teacher = await prisma.user.findUnique({
      where: { 
        id: teacherId,
        role: 'teacher'
      }
    })
    
    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    // Check if availability exists and belongs to the teacher
    const availability = await prisma.availability.findUnique({
      where: {
        id: availabilityId,
        teacherId
      }
    })
    
    if (!availability) {
      throw createError({
        statusCode: 404,
        message: 'Availability slot not found'
      })
    }
    
    // Check if the time slot is already booked
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    
    const existingBooking = await prisma.booking.findFirst({
      where: {
        teacherId,
        availabilityId,
        OR: [
          {
            // New booking starts during an existing booking
            AND: [
              { startTime: { lte: startTimeDate } },
              { endTime: { gt: startTimeDate } }
            ]
          },
          {
            // New booking ends during an existing booking
            AND: [
              { startTime: { lt: endTimeDate } },
              { endTime: { gte: endTimeDate } }
            ]
          },
          {
            // New booking completely contains an existing booking
            AND: [
              { startTime: { gte: startTimeDate } },
              { endTime: { lte: endTimeDate } }
            ]
          }
        ]
      }
    })
    
    if (existingBooking) {
      throw createError({
        statusCode: 409,
        message: 'This time slot is already booked'
      })
    }
    
    // Calculate booking amount (e.g., $50 per hour)
    const hourlyRate = 50 // In a real app, this would come from the teacher's profile
    const durationMs = endTimeDate.getTime() - startTimeDate.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)
    const amount = Math.round(hourlyRate * durationHours * 100) // Convert to cents for Stripe
    
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        studentId: user.id,
        teacherId,
        availabilityId,
        startTime: startTime.toString(),
        endTime: endTime.toString()
      }
    })
    
    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        studentId: user.id,
        teacherId,
        availabilityId,
        startTime: startTimeDate,
        endTime: endTimeDate,
        status: 'pending',
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'pending',
        amount: amount / 100, // Store in dollars
        currency: 'USD'
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
    
    return {
      booking,
      clientSecret: paymentIntent.client_secret
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create booking'
    })
  }
})
