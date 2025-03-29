import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'
import { createUser } from '~/server/utils/auth'

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
    
    // Only admins can create teacher accounts
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Only administrators can create teacher accounts'
      })
    }
    
    // Get teacher data from request body
    const { firstName, lastName, email, password, bio, subjects } = await readBody(event)
    
    if (!firstName || !lastName || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'First name, last name, email, and password are required'
      })
    }
    
    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email is already in use'
      })
    }
    
    // Create teacher account
    const teacher = await createUser({
      firstName,
      lastName,
      email,
      password,
      role: 'teacher'
    })
    
    // Update teacher with bio if provided
    if (bio) {
      await prisma.user.update({
        where: { id: teacher.id },
        data: { bio }
      })
    }
    
    // Add subjects if provided
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      // Create any new subjects that don't exist
      for (const subjectName of subjects) {
        // Check if subject exists
        let subject = await prisma.subject.findFirst({
          where: { name: subjectName }
        })
        
        // Create subject if it doesn't exist
        if (!subject) {
          subject = await prisma.subject.create({
            data: { name: subjectName }
          })
        }
        
        // Connect subject to teacher
        await prisma.user.update({
          where: { id: teacher.id },
          data: {
            subjects: {
              connect: { id: subject.id }
            }
          }
        })
      }
    }
    
    // Get the updated teacher with subjects
    const updatedTeacher = await prisma.user.findUnique({
      where: { id: teacher.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        role: true,
        subjects: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
    return updatedTeacher
  } catch (error) {
    console.error('Error creating teacher account:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create teacher account'
    })
  }
})
