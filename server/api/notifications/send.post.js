import { connectToDatabase } from '../../config/database.js'
import { connectToMongoDB } from '../../utils/mongodb.js'
import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase()
    const db = await connectToMongoDB()
    
    // Vérifier l'authentification (seuls les admins ou le système peuvent envoyer des notifications)
    const auth = event.context.auth
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      })
    }

    const body = await readBody(event)
    const { userId, title, body: messageBody, icon, data, actions } = body

    if (!userId || !title || !messageBody) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Données de notification incomplètes'
      })
    }

    // Récupérer l'abonnement de l'utilisateur
    const collection = db.collection('push_subscriptions')
    const subscription = await collection.findOne({ userId: userId })

    if (!subscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Aucun abonnement trouvé pour cet utilisateur'
      })
    }

    // Configurer web-push avec les clés VAPID
    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Clés VAPID non configurées'
      })
    }

    webpush.setVapidDetails(
      'mailto:contact@academ.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    )

    // Préparer les données de notification
    const notificationData = {
      title: title,
      body: messageBody,
      icon: icon || '/icon512_rounded.png',
      badge: '/icon512_rounded.png',
      data: data || {},
      actions: actions || [
        {
          action: 'view',
          title: 'Voir',
          icon: '/icon512_rounded.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icon512_rounded.png'
        }
      ]
    }

    // Envoyer la notification
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    }

    const payload = JSON.stringify(notificationData)
    
    try {
      await webpush.sendNotification(pushSubscription, payload)
      console.log(`Notification envoyée à l'utilisateur ${userId}: ${title}`)
      
      return {
        success: true,
        message: 'Notification envoyée avec succès'
      }
    } catch (pushError) {
      console.error('Erreur lors de l\'envoi de la notification:', pushError)
      
      // Si l'abonnement est invalide, le supprimer
      if (pushError.statusCode === 410) {
        await collection.deleteOne({ userId: userId })
        console.log(`Abonnement invalide supprimé pour l'utilisateur ${userId}`)
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de l\'envoi de la notification'
      })
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'envoi de notification'
    })
  }
})
