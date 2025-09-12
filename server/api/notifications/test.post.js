import { connectToDatabase } from '../../config/database.js'
import { connectToMongoDB } from '../../utils/mongodb.js'
import webpush from 'web-push'

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

    // Configurer web-push avec les clés VAPID
    const config = useRuntimeConfig()
    const vapidKeys = {
      publicKey: config.VAPID_PUBLIC_KEY,
      privateKey: config.VAPID_PRIVATE_KEY
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

    // Récupérer l'abonnement de l'utilisateur
    const collection = db.collection('push_subscriptions')
    const subscription = await collection.findOne({ userId: auth.user._id })

    if (!subscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Aucun abonnement trouvé pour cet utilisateur'
      })
    }

    // Préparer les données de notification de test
    const notificationData = {
      title: 'Test de notification',
      body: 'Ceci est un test de notification push !',
      icon: '/icon512_rounded.png',
      badge: '/icon512_rounded.png',
      data: {
        url: '/dashboard',
        type: 'test_notification'
      },
      actions: [
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
      console.log(`Notification de test envoyée à l'utilisateur ${auth.user._id}`)

      return {
        success: true,
        message: 'Notification de test envoyée avec succès'
      }
    } catch (pushError) {
      console.error('Erreur lors de l\'envoi de la notification de test:', pushError)

      // Si l'abonnement est invalide, le supprimer
      if (pushError.statusCode === 410) {
        await collection.deleteOne({ userId: auth.user._id })
        console.log(`Abonnement invalide supprimé pour l'utilisateur ${auth.user._id}`)
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de l\'envoi de la notification de test'
      })
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification de test:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'envoi de notification de test'
    })
  }
})
