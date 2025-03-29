import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'

const prisma = new PrismaClient()

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  teacherId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
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
    
    // Get review data from request body
    const { bookingId, rating, comment } = await readBody(event)
    
    if (!bookingId || !rating) {
      throw createError({
        statusCode: 400,
        message: 'Booking ID and rating are required'
      })
    }
    
    if (rating < 1 || rating > 5) {
      throw createError({
        statusCode: 400,
        message: 'Rating must be between 1 and 5'
      })
    }
    
    // Check if booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        studentId: user.id,
        status: 'completed'
      }
    })
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found or not eligible for review'
      })
    }
    
    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId
      }
    })
    
    if (existingReview) {
      throw createError({
        statusCode: 409,
        message: 'Review already exists for this booking'
      })
    }
    
    // Create new review
    const review = await prisma.review.create({
      data: {
        bookingId,
        studentId: user.id,
        teacherId: booking.teacherId,
        rating,
        comment
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
    
    return review
  } catch (error) {
    console.error('Error creating review:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create review'
    })
  }
})
