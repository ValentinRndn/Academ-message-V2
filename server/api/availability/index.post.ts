import { defineEventHandler, readBody, createError } from 'h3'
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
    
    // Only teachers can set availability
    if (user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        message: 'Only teachers can set availability'
      })
    }
    
    // Get availability data from request body
    const { dayOfWeek, startTime, endTime, recurring, date } = await readBody(event)
    
    if (dayOfWeek === undefined || !startTime || !endTime) {
      throw createError({
        statusCode: 400,
        message: 'Day of week, start time, and end time are required'
      })
    }
    
    // Validate day of week
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw createError({
        statusCode: 400,
        message: 'Day of week must be between 0 (Sunday) and 6 (Saturday)'
      })
    }
    
    // Validate times
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    if (end <= start) {
      throw createError({
        statusCode: 400,
        message: 'End time must be after start time'
      })
    }
    
    // If not recurring, date is required
    if (recurring === false && !date) {
      throw createError({
        statusCode: 400,
        message: 'Date is required for non-recurring availability'
      })
    }
    
    // Create new availability
    const availability = await prisma.availability.create({
      data: {
        teacherId: user.id,
        dayOfWeek,
        startTime: start,
        endTime: end,
        recurring: recurring !== false, // Default to true if not specified
        date: date ? new Date(date) : null
      }
    })
    
    return availability
  } catch (error) {
    console.error('Error setting availability:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to set availability'
    })
  }
})
