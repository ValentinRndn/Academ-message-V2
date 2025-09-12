import Booking from '../../models/Booking.js';
import { connectToDatabase } from '../../config/database.js';
import { sendBookingConfirmationToStudent, sendBookingNotificationToTeacher } from '../../services/emailService.js';

// Initialiser Stripe avec la clé secrète
import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    
    // Récupérer la configuration runtime
    const config = useRuntimeConfig();
    const stripeSecretKey = config.STRIPE_SECRET_KEY;
    const webhookSecret = config.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY manquante');
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Error',
        message: 'Configuration Stripe manquante'
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    
    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET n\'est pas défini');
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Error',
        message: 'Configuration webhook manquante'
      });
    }

    let stripeEvent;

    try {
      // Vérifier la signature du webhook
      stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erreur de vérification du webhook Stripe:', err);
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Signature webhook invalide'
      });
    }

    console.log(`Webhook Stripe reçu: ${stripeEvent.type}`);

    // Traiter les différents types d'événements
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(stripeEvent.data.object);
        break;

      case 'charge.dispute.created':
        await handleChargeDispute(stripeEvent.data.object);
        break;

      default:
        console.log(`Type d'événement non géré: ${stripeEvent.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors du traitement du webhook'
    });
  }
});

// Gérer le paiement réussi
async function handlePaymentSucceeded(paymentIntent) {
  try {
    const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntent.id })
      .populate('teacherId', 'firstName lastName email')
      .populate('studentId', 'firstName lastName email')
      .populate('subjectId', 'name');

    if (!booking) {
      console.error(`Réservation non trouvée pour le paiement: ${paymentIntent.id}`);
      return;
    }

    // Mettre à jour le statut de paiement et confirmer la réservation
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    await booking.save();

    console.log(`Paiement confirmé pour la réservation ${booking._id}`);

    // Envoyer les emails de confirmation
    try {
      await Promise.all([
        sendBookingConfirmationToStudent(booking),
        sendBookingNotificationToTeacher(booking)
      ]);
      console.log('📧 Emails de confirmation envoyés avec succès');
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi des emails:', emailError);
      // Ne pas faire échouer le webhook à cause d'une erreur d'email
    }

    // TODO: Créer une notification dans l'application
    // TODO: Envoyer un message Socket.io en temps réel

    // Exemple de log pour traçabilité
    console.log(`
      📅 Réservation confirmée:
      - ID: ${booking._id}
      - Étudiant: ${booking.studentId.firstName} ${booking.studentId.lastName}
      - Professeur: ${booking.teacherId.firstName} ${booking.teacherId.lastName}
      - Matière: ${booking.subjectId.name}
      - Date: ${booking.startTime.toLocaleDateString()} ${booking.startTime.toLocaleTimeString()}
      - Montant total: ${booking.totalAmount}€
      - Montant professeur: ${booking.teacherAmount}€
      - Commission: ${booking.platformCommission}€
    `);

  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error);
    throw error;
  }
}

// Gérer l'échec du paiement
async function handlePaymentFailed(paymentIntent) {
  try {
    const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntent.id });

    if (!booking) {
      console.error(`Réservation non trouvée pour le paiement échoué: ${paymentIntent.id}`);
      return;
    }

    // Mettre à jour le statut
    booking.paymentStatus = 'failed';
    await booking.save();

    console.log(`Paiement échoué pour la réservation ${booking._id}`);

    // TODO: Notifier l'étudiant de l'échec du paiement
    // TODO: Proposer de réessayer le paiement

  } catch (error) {
    console.error('Erreur lors du traitement du paiement échoué:', error);
    throw error;
  }
}

// Gérer l'annulation du paiement
async function handlePaymentCanceled(paymentIntent) {
  try {
    const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntent.id });

    if (!booking) {
      console.error(`Réservation non trouvée pour le paiement annulé: ${paymentIntent.id}`);
      return;
    }

    // Remettre en attente
    booking.paymentStatus = 'pending';
    await booking.save();

    console.log(`Paiement annulé pour la réservation ${booking._id}`);

  } catch (error) {
    console.error('Erreur lors du traitement du paiement annulé:', error);
    throw error;
  }
}

// Gérer les litiges/remboursements
async function handleChargeDispute(charge) {
  try {
    // TODO: Implémenter la gestion des litiges
    console.log(`Litige créé pour le charge: ${charge.id}`);
    
  } catch (error) {
    console.error('Erreur lors du traitement du litige:', error);
    throw error;
  }
}
