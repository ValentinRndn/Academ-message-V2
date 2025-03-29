import { defineEventHandler, getQuery, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'

const prisma = new PrismaClient()

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
    const { status } = getQuery(event)
    
    // Build filter conditions
    const whereConditions: any = {}
    
    // Filter by user role
    if (user.role === 'student') {
      whereConditions.studentId = user.id
    } else if (user.role === 'teacher') {
      whereConditions.teacherId = user.id
    } else {
      // Admin can see all bookings
    }
    
    // Filter by status if provided
    if (status) {
      whereConditions.status = status
    }
    
    // Get bookings
    const bookings = await prisma.booking.findMany({
      where: whereConditions,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        availability: true,
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })
    
    // Group bookings by status
    const groupedBookings = {
      upcoming: bookings.filter(booking => 
        booking.status !== 'cancelled' && booking.status !== 'completed' && new Date(booking.startTime) > new Date()
      ),
      past: bookings.filter(booking => 
        booking.status === 'completed' || new Date(booking.endTime) < new Date()
      ),
      cancelled: bookings.filter(booking => 
        booking.status === 'cancelled'
      )
    }
    
    return groupedBookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch bookings'
    })
  }
})
