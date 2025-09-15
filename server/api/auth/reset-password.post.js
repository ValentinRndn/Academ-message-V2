import { findUserByEmail, updateUser } from '../../models/userModel.js'
import { hashPassword } from '../../utils/password.js'
import { connectToMongoDB } from '../../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    const { token, password } = await readBody(event)

    if (!token || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token et mot de passe requis'
      })
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins 8 caractères'
      })
    }

    if (!/[A-Z]/.test(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins une majuscule'
      })
    }

    if (!/\d/.test(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins un chiffre'
      })
    }

    const db = await connectToMongoDB()

    // Trouver l'utilisateur avec le token valide
    const user = await db.collection('users').findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token invalide ou expiré'
      })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(password)

    // Mettre à jour le mot de passe et supprimer le token
    await updateUser(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    })

    console.log(`✅ Mot de passe réinitialisé pour: ${user.email}`)

    return {
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès.'
    }

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la réinitialisation du mot de passe'
    })
  }
})