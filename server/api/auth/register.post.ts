import { defineEventHandler, readBody } from 'h3'
import { createUser, getUserByEmail } from '~/server/utils/auth'
import { generateToken } from '~/server/utils/jwt'
import { H3Error } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { firstName, lastName, email, password } = await readBody(event)
    
    if (!firstName || !lastName || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'All fields are required'
      })
    }
    
    // Check if email is already in use
    const existingUser = await getUserByEmail(email)
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email is already in use'
      })
    }
    
    // Create new user with student role
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      role: 'student'
    })
    
    // Don't include password in the response
    const { password: _, ...userWithoutPassword } = newUser
    
    // Generate JWT token
    const token = generateToken(userWithoutPassword)
    
    return {
      user: userWithoutPassword,
      token
    }
  } catch (error) {
    if (error instanceof H3Error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred during registration'
    })
  }
})
