import { defineEventHandler, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import { verifyToken, extractTokenFromHeader } from '~/server/utils/jwt'

const prisma = new PrismaClient()

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
}

interface SentMessage {
  id: string;
  content: string;
  createdAt: Date;
  read: boolean;
  receiver: User;
}

interface ReceivedMessage {
  id: string;
  content: string;
  createdAt: Date;
  read: boolean;
  sender: User;
}

interface Conversation {
  partner: User;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    read: boolean;
    sender: 'me' | 'other';
  }>;
  lastMessage: {
    content: string;
    createdAt: Date;
  } | null;
  unreadCount: number;
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
    
    // Get all conversations for the user
    const sentMessages = await prisma.message.findMany({
      where: {
        senderId: user.id
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        read: true,
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const receivedMessages = await prisma.message.findMany({
      where: {
        receiverId: user.id
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        read: true,
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Group messages by conversation partner
    const conversations: Record<string, Conversation> = {}
    
    // Process sent messages
    sentMessages.forEach((message: SentMessage) => {
      const partnerId = message.receiver.id
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: message.receiver,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[partnerId].messages.push({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        sender: 'me'
      })
      
      // Update last message if this is more recent
      if (!conversations[partnerId].lastMessage || 
          message.createdAt > conversations[partnerId].lastMessage.createdAt) {
        conversations[partnerId].lastMessage = {
          content: message.content,
          createdAt: message.createdAt
        }
      }
    })
    
    // Process received messages
    receivedMessages.forEach((message: ReceivedMessage) => {
      const partnerId = message.sender.id
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: message.sender,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[partnerId].messages.push({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        sender: 'other'
      })
      
      // Update last message if this is more recent
      if (!conversations[partnerId].lastMessage || 
          message.createdAt > conversations[partnerId].lastMessage.createdAt) {
        conversations[partnerId].lastMessage = {
          content: message.content,
          createdAt: message.createdAt
        }
      }
      
      // Count unread messages
      if (!message.read) {
        conversations[partnerId].unreadCount++
      }
    })
    
    // Convert to array and sort by most recent message
    const conversationList = Object.values(conversations)
      .sort((a: Conversation, b: Conversation) => {
        if (!a.lastMessage) return 1
        if (!b.lastMessage) return -1
        return b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
      })
      .map((conversation: Conversation) => {
        // Sort messages by date
        conversation.messages.sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        )
        return conversation
      })
    
    return conversationList
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch messages'
    })
  }
})
