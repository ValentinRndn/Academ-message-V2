import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'

const prisma = new PrismaClient()

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  read: boolean;
  sender: User;
  receiver: User;
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
    
    // Get message data from request body
    const { receiverId, content } = await readBody(event)
    
    if (!receiverId || !content) {
      throw createError({
        statusCode: 400,
        message: 'Receiver ID and content are required'
      })
    }
    
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })
    
    if (!receiver) {
      throw createError({
        statusCode: 404,
        message: 'Receiver not found'
      })
    }
    
    // Create new message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
    
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      read: message.read,
      sender: message.sender,
      receiver: message.receiver
    }
  } catch (error) {
    console.error('Error sending message:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to send message'
    })
  }
})
