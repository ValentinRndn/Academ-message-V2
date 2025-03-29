import { hash, compare } from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

export interface UserCreateInput {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  })
}

/**
 * Create a new user
 */
export async function createUser(userData: UserCreateInput) {
  const hashedPassword = await hash(userData.password, SALT_ROUNDS)
  
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  })
}

/**
 * Verify a password against a hashed password
 */
export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

/**
 * Create a teacher account (admin only)
 */
export async function createTeacher(userData: UserCreateInput, adminId: string) {
  // Verify the admin user
  const admin = await getUserById(adminId)
  
  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can create teacher accounts')
  }
  
  // Create the teacher account
  return createUser({
    ...userData,
    role: 'teacher'
  })
}
