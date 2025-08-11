import { generateToken } from '../../utils/jwt'
import bcrypt from 'bcrypt'
import { prisma } from '../../config/database'

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du corps de la requête
    const { email, password } = await readBody(event)
    
    // Validation des données
    if (!email || !password) {
      return createError({
        statusCode: 400,
        message: 'Email et mot de passe requis'
      })
    }
    
    // Rechercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    // Vérifier si l'utilisateur existe
    if (!user) {
      return createError({
        statusCode: 401,
        message: 'Email ou mot de passe invalide'
      })
    }
    
    // Pour la démonstration, accepter des comptes de test sans vérification de mot de passe
    const isDemoAccount = (
      (email === 'student@example.com' && password === 'password123') ||
      (email === 'teacher@example.com' && password === 'password123') ||
      (email === 'admin@example.com' && password === 'adminpass123')
    )
    
    // Vérifier le mot de passe (sauf pour les comptes de démonstration)
    if (!isDemoAccount) {
      // Dans MongoDB, le champ s'appelle "password" et non "passwordHash"
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      if (!isPasswordValid) {
        return createError({
          statusCode: 401,
          message: 'Email ou mot de passe invalide'
        })
      }
    }
    
    // Vérifier si le compte est actif
    if (user.status !== 'active' && !isDemoAccount) {
      return createError({
        statusCode: 403,
        message: `Votre compte est ${user.status}. Veuillez contacter le support.`
      })
    }
    
    // Mettre à jour la date de dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
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
        role: user.role
      }
    }
    
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Une erreur est survenue pendant la connexion'
    })
  }
})