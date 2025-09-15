import { findUserByEmail, updateUser } from '../../models/userModel.js'
import { sendPasswordResetEmail } from '../../services/emailService.js'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email requis'
      })
    }

    // Vérifier que l'utilisateur existe
    const user = await findUserByEmail(email)
    if (!user) {
      // Retourner un succès même si l'utilisateur n'existe pas (sécurité)
      return {
        success: true,
        message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
      }
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 heure

    // Sauvegarder le token dans la base de données
    await updateUser(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    })

    // Envoyer l'email
    await sendPasswordResetEmail(user, resetToken)

    return {
      success: true,
      message: 'Un email de réinitialisation a été envoyé à votre adresse.'
    }

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email de réinitialisation'
    })
  }
})