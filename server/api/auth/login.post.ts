import { defineEventHandler, readBody } from 'h3'
import { getUserByEmail, verifyPassword } from '~/server/utils/auth'
import { generateToken } from '~/server/utils/jwt'
import { H3Error } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }
    
    const user = await getUserByEmail(email)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }
    
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }
    
    // Don't include password in the response
    const { password: _, ...userWithoutPassword } = user
    
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
      message: 'An error occurred during login'
    })
  }
})
