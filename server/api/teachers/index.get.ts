import { defineEventHandler, getQuery, createError } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { search, subject } = getQuery(event)
    
    // Build filter conditions
    const whereConditions: any = {
      role: 'teacher'
    }
    
    // Add search filter if provided
    if (search) {
      const searchRegex = { $regex: search as string, $options: 'i' }
      whereConditions.OR = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { bio: searchRegex }
      ]
    }
    
    // Add subject filter if provided
    if (subject) {
      whereConditions.subjectIds = {
        has: subject as string
      }
    }
    
    // Get teachers
    const teachers = await prisma.user.findMany({
      where: whereConditions,
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
    
    // Get all subjects to map to teachers
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    })
    
    // Get all reviews to calculate average ratings
    const reviews = await prisma.review.findMany({
      where: {
        teacherId: {
          in: teachers.map(teacher => teacher.id)
        }
      },
      select: {
        teacherId: true,
        rating: true
      }
    })
    
    // Calculate average rating for each teacher and add subject details
    const teachersWithDetails = teachers.map((teacher) => {
      // Get reviews for this teacher
      const teacherReviews = reviews.filter(review => review.teacherId === teacher.id)
      const averageRating = teacherReviews.length > 0
        ? teacherReviews.reduce((sum, review) => sum + review.rating, 0) / teacherReviews.length
        : null
      
      // Get subject details for this teacher
      const teacherSubjects = subjects.filter(subject => 
        teacher.subjectIds.includes(subject.id)
      )
      
      return {
        ...teacher,
        subjects: teacherSubjects,
        averageRating,
        reviewCount: teacherReviews.length
      }
    })
    
    return teachersWithDetails
  } catch (error) {
    console.error('Error fetching teachers:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch teachers'
    })
  }
})
