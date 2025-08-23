import { connectToDatabase } from '../config/database.js'
import { connectToMongoDB } from '../utils/mongodb.js'
import webpush from 'web-push'

// Configurer web-push
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
}

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:contact@academ.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

// Fonction utilitaire pour envoyer une notification
async function sendNotificationToUser(userId, notificationData) {
  try {
    await connectToDatabase()
    const db = await connectToMongoDB()
    
    // Récupérer l'abonnement de l'utilisateur
    const collection = db.collection('push_subscriptions')
    const subscription = await collection.findOne({ userId: userId })

    if (!subscription) {
      console.log(`Aucun abonnement trouvé pour l'utilisateur ${userId}`)
      return false
    }

    // Préparer les données de notification
    const payload = {
      title: notificationData.title,
      body: notificationData.body,
      icon: notificationData.icon || '/icon512_rounded.png',
      badge: '/icon512_rounded.png',
      data: notificationData.data || {},
      actions: notificationData.actions || [
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

    await webpush.sendNotification(pushSubscription, JSON.stringify(payload))
    console.log(`Notification envoyée à l'utilisateur ${userId}: ${notificationData.title}`)
    return true
  } catch (error) {
    console.error(`Erreur lors de l'envoi de notification à l'utilisateur ${userId}:`, error)
    
    // Si l'abonnement est invalide, le supprimer
    if (error.statusCode === 410) {
      try {
        await connectToDatabase()
        const db = await connectToMongoDB()
        const collection = db.collection('push_subscriptions')
        await collection.deleteOne({ userId: userId })
        console.log(`Abonnement invalide supprimé pour l'utilisateur ${userId}`)
      } catch (deleteError) {
        console.error('Erreur lors de la suppression de l\'abonnement invalide:', deleteError)
      }
    }
    
    return false
  }
}

// Notifications pour les réservations
export async function notifyBookingCreated(booking, teacher, student) {
  // Notification pour l'étudiant
  await sendNotificationToUser(student._id, {
    title: 'Réservation confirmée !',
    body: `Votre cours avec ${teacher.firstName} ${teacher.lastName} a été réservé avec succès.`,
    data: {
      url: `/student/bookings`,
      type: 'booking_created'
    }
  })

  // Notification pour le professeur
  await sendNotificationToUser(teacher._id, {
    title: 'Nouvelle réservation !',
    body: `${student.firstName} ${student.lastName} a réservé un cours avec vous.`,
    data: {
      url: `/teacher/schedule`,
      type: 'new_booking'
    }
  })
}

export async function notifyBookingConfirmed(booking, teacher, student) {
  // Notification pour l'étudiant
  await sendNotificationToUser(student._id, {
    title: 'Cours confirmé !',
    body: `${teacher.firstName} ${teacher.lastName} a confirmé votre cours.`,
    data: {
      url: `/student/bookings`,
      type: 'booking_confirmed'
    }
  })
}

export async function notifyBookingCancelled(booking, teacher, student, cancelledBy) {
  const cancelledByText = cancelledBy === 'teacher' ? 'le professeur' : 'vous'
  
  // Notification pour l'étudiant
  await sendNotificationToUser(student._id, {
    title: 'Cours annulé',
    body: `Votre cours avec ${teacher.firstName} ${teacher.lastName} a été annulé par ${cancelledByText}.`,
    data: {
      url: `/student/bookings`,
      type: 'booking_cancelled'
    }
  })

  // Notification pour le professeur
  await sendNotificationToUser(teacher._id, {
    title: 'Cours annulé',
    body: `Le cours avec ${student.firstName} ${student.lastName} a été annulé par ${cancelledByText}.`,
    data: {
      url: `/teacher/schedule`,
      type: 'booking_cancelled'
    }
  })
}

// Notifications pour les messages
export async function notifyNewMessage(message, sender, receiver) {
  await sendNotificationToUser(receiver._id, {
    title: `Nouveau message de ${sender.firstName}`,
    body: message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content,
    data: {
      url: `/messages`,
      type: 'new_message',
      conversationId: message.conversationId
    }
  })
}

// Notifications pour les rappels de cours
export async function notifyCourseReminder(booking, teacher, student) {
  const startTime = new Date(booking.startTime)
  const timeString = startTime.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  // Notification pour l'étudiant
  await sendNotificationToUser(student._id, {
    title: 'Rappel de cours',
    body: `Votre cours avec ${teacher.firstName} ${teacher.lastName} commence dans 1 heure (${timeString}).`,
    data: {
      url: `/student/bookings`,
      type: 'course_reminder'
    }
  })

  // Notification pour le professeur
  await sendNotificationToUser(teacher._id, {
    title: 'Rappel de cours',
    body: `Votre cours avec ${student.firstName} ${student.lastName} commence dans 1 heure (${timeString}).`,
    data: {
      url: `/teacher/schedule`,
      type: 'course_reminder'
    }
  })
}

// Notifications pour les avis
export async function notifyNewReview(review, teacher, student) {
  // Notification pour le professeur
  await sendNotificationToUser(teacher._id, {
    title: 'Nouvel avis reçu !',
    body: `${student.firstName} ${student.lastName} a laissé un avis sur votre cours.`,
    data: {
      url: `/teacher/reviews`,
      type: 'new_review'
    }
  })
}

// Notifications pour les paiements
export async function notifyPaymentSuccess(booking, teacher, student) {
  // Notification pour l'étudiant
  await sendNotificationToUser(student._id, {
    title: 'Paiement confirmé !',
    body: `Votre paiement pour le cours avec ${teacher.firstName} ${teacher.lastName} a été confirmé.`,
    data: {
      url: `/student/bookings`,
      type: 'payment_success'
    }
  })

  // Notification pour le professeur
  await sendNotificationToUser(teacher._id, {
    title: 'Paiement reçu !',
    body: `Le paiement pour votre cours avec ${student.firstName} ${student.lastName} a été effectué.`,
    data: {
      url: `/teacher/schedule`,
      type: 'payment_received'
    }
  })
}

// Notifications pour les changements de disponibilité
export async function notifyAvailabilityChanged(teacher, students) {
  const notificationData = {
    title: 'Disponibilités mises à jour',
    body: `${teacher.firstName} ${teacher.lastName} a mis à jour ses disponibilités.`,
    data: {
      url: `/teachers/${teacher._id}`,
      type: 'availability_changed'
    }
  }

  // Envoyer à tous les étudiants qui ont des réservations avec ce professeur
  for (const student of students) {
    await sendNotificationToUser(student._id, notificationData)
  }
}

// Notifications pour les nouveaux professeurs
export async function notifyNewTeacher(teacher) {
  try {
    await connectToDatabase()
    const db = await connectToMongoDB()
    
    // Récupérer tous les étudiants
    const studentsCollection = db.collection('users')
    const students = await studentsCollection.find({ role: 'student' }).toArray()

    const notificationData = {
      title: 'Nouveau professeur disponible !',
      body: `${teacher.firstName} ${teacher.lastName} rejoint Academ. Découvrez ses matières !`,
      data: {
        url: `/teachers/${teacher._id}`,
        type: 'new_teacher'
      }
    }

    // Envoyer à tous les étudiants
    for (const student of students) {
      await sendNotificationToUser(student._id, notificationData)
    }
  } catch (error) {
    console.error('Erreur lors de la notification pour nouveau professeur:', error)
  }
}

// Fonction utilitaire pour envoyer une notification personnalisée
export async function sendCustomNotification(userId, title, body, data = {}) {
  return await sendNotificationToUser(userId, {
    title,
    body,
    data
  })
}
