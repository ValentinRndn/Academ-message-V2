import { connectToDatabase } from '../../config/database.js'
import { connectToMongoDB } from '../../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()
    const db = await connectToMongoDB()
    
    // Vérifier l'authentification
    const auth = event.context.auth
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      })
    }

    // Supprimer l'abonnement de la base de données
    const collection = db.collection('push_subscriptions')
    const result = await collection.deleteOne({ userId: auth.user._id })

    if (result.deletedCount > 0) {
      console.log(`Abonnement aux notifications supprimé pour l'utilisateur ${auth.user._id}`)
    }

    return {
      success: true,
      message: 'Désabonnement effectué avec succès'
    }
  } catch (error) {
    console.error('Erreur lors du désabonnement aux notifications:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors du désabonnement aux notifications'
    })
  }
})
