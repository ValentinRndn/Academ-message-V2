import { defineEventHandler, createError } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Teacher ID is required'
      })
    }
    
    // Get teacher
    const teacher = await prisma.user.findUnique({
      where: {
        id,
        role: 'teacher'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        avatar: true,
        subjectIds: true
      }
    })
    
    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    // Get subjects for this teacher
    const subjects = await prisma.subject.findMany({
      where: {
        id: {
          in: teacher.subjectIds
        }
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    })
    
    // Get availability for this teacher
    const availability = await prisma.availability.findMany({
      where: {
        teacherId: id
      },
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        recurring: true,
        date: true
      }
    })
    
    // Get reviews for this teacher
    const reviews = await prisma.review.findMany({
      where: {
        teacherId: id
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        studentId: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })
    
    // Get student details for reviews
    const studentIds = reviews.map(review => review.studentId)
    const students = await prisma.user.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true
      }
    })
    
    // Add student details to reviews
    const reviewsWithStudents = reviews.map(review => {
      const student = students.find(s => s.id === review.studentId)
      return {
        ...review,
        student
      }
    })
    
    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null
    
    return {
      ...teacher,
      subjects,
      availability,
      teacherReviews: reviewsWithStudents,
      averageRating,
      reviewCount: reviews.length
    }
  } catch (error) {
    console.error('Error fetching teacher:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch teacher details'
    })
  }
})
