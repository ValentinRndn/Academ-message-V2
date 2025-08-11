import { PrismaClient } from '@prisma/client'
import { generateToken } from '../../utils/jwt'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du corps de la requête
    const { firstName, lastName, email, password, role } = await readBody(event)
    
    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return createError({
        statusCode: 400,
        message: 'All fields are required'
      })
    }
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return createError({
        statusCode: 400,
        message: 'Email already in use'
      })
    }
    
    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    
    // Déterminer le statut initial en fonction du rôle
    const initialStatus = role === 'teacher' ? 'pending' : 'active'
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: role || 'student',
        status: initialStatus
      }
    })
    
    // Générer un token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    })
    
    // Retourner le token et les informations de l'utilisateur
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'An error occurred during registration'
    })
  }
})