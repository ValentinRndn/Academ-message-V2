import { defineEventHandler, createError } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const teacherId = event.context.params?.id
    
    if (!teacherId) {
      throw createError({
        statusCode: 400,
        message: 'Teacher ID is required'
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
    
    // Get teacher's availability
    const availability = await prisma.availability.findMany({
      where: {
        teacherId
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    // Get existing bookings for this teacher
    const bookings = await prisma.booking.findMany({
      where: {
        teacherId,
        status: { not: 'cancelled' },
        startTime: {
          gte: new Date() // Only future bookings
        }
      },
      select: {
        id: true,
        availabilityId: true,
        startTime: true,
        endTime: true,
        status: true
      }
    })
    
    // Group availability by day of week
    const availabilityByDay: Record<string, any[]> = {
      '0': [], // Sunday
      '1': [], // Monday
      '2': [], // Tuesday
      '3': [], // Wednesday
      '4': [], // Thursday
      '5': [], // Friday
      '6': []  // Saturday
    }
    
    // Add one-time availability to special array
    const oneTimeAvailability: any[] = []
    
    // Process availability
    availability.forEach((slot) => {
      const availabilityWithBookings = {
        ...slot,
        bookings: bookings.filter(booking => booking.availabilityId === slot.id)
      }
      
      if (slot.recurring) {
        availabilityByDay[slot.dayOfWeek.toString()].push(availabilityWithBookings)
      } else {
        oneTimeAvailability.push(availabilityWithBookings)
      }
    })
    
    return {
      recurring: availabilityByDay,
      oneTime: oneTimeAvailability
    }
  } catch (error) {
    console.error('Error fetching teacher availability:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch teacher availability'
    })
  }
})
