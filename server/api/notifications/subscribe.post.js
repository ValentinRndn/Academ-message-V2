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

    const body = await readBody(event)
    const { endpoint, keys } = body

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Données d\'abonnement incomplètes'
      })
    }

    // Sauvegarder l'abonnement dans la base de données
    const subscription = {
      userId: auth.user._id,
      endpoint: endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth
      },
      createdAt: new Date()
    }

    // Utiliser la collection push_subscriptions
    const collection = db.collection('push_subscriptions')
    
    // Supprimer l'ancien abonnement s'il existe
    await collection.deleteOne({ userId: auth.user._id })
    
    // Insérer le nouvel abonnement
    await collection.insertOne(subscription)

    console.log(`Abonnement aux notifications créé pour l'utilisateur ${auth.user._id}`)

    return {
      success: true,
      message: 'Abonnement aux notifications créé avec succès'
    }
  } catch (error) {
    console.error('Erreur lors de l\'abonnement aux notifications:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'abonnement aux notifications'
    })
  }
})
