import { defineEventHandler, createError } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get all subjects
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        teacherIds: true
      }
    })
    
    // Get all teachers to map to subjects
    const teachers = await prisma.user.findMany({
      where: {
        role: 'teacher'
      },
      select: {
        id: true
      }
    })
    
    // Add teacher count to each subject
    const subjectsWithTeacherCount = subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      teacherCount: subject.teacherIds.length
    }))
    
    return subjectsWithTeacherCount
  } catch (error) {
    console.error('Error fetching subjects:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subjects'
    })
  }
})
