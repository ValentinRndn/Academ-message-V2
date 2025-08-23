import Booking from '../../models/Booking.js';
import { connectToDatabase } from '../../config/database.js';
import { ObjectId } from 'mongodb';

// Initialiser Stripe avec la clé secrète
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_replace_with_your_actual_key');

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est authentifié
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    const body = await readBody(event);
    const { bookingId } = body;

    // Validation des données
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de réservation obligatoire'
      });
    }

    if (!ObjectId.isValid(bookingId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de réservation invalide'
      });
    }

    // Récupérer la réservation
    const booking = await Booking.findById(bookingId)
      .populate('teacherId', 'firstName lastName')
      .populate('subjectId', 'name');

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de la réservation
    if (booking.studentId.toString() !== auth.user._id.toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé à cette réservation'
      });
    }

    // Vérifier que la réservation peut être payée
    if (booking.status !== 'pending') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cette réservation ne peut plus être payée'
      });
    }

    if (booking.paymentStatus === 'paid') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cette réservation est déjà payée'
      });
    }

    // Vérifier que la réservation n'est pas dans le passé
    if (new Date() > booking.startTime) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Impossible de payer une réservation passée'
      });
    }

    try {
      // Créer l'intention de paiement avec Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Stripe utilise les centimes
        currency: booking.currency.toLowerCase(),
        metadata: {
          bookingId: booking._id.toString(),
          studentId: booking.studentId.toString(),
          teacherId: booking.teacherId._id.toString(),
          subjectName: booking.subjectId.name,
          sessionDate: booking.startTime.toISOString(),
          duration: booking.duration.toString(),
          teacherAmount: booking.teacherAmount.toString(),
          platformCommission: booking.platformCommission.toString()
        },
        description: `Séance de ${booking.subjectId.name} avec ${booking.teacherId.firstName} ${booking.teacherId.lastName}`,
        receipt_email: auth.user.email || undefined,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Mettre à jour la réservation avec l'ID de l'intention de paiement
      booking.stripePaymentIntentId = paymentIntent.id;
      booking.paymentStatus = 'processing';
      await booking.save();

      console.log(`Intention de paiement créée: ${paymentIntent.id} pour la réservation ${booking._id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.totalAmount,
        currency: booking.currency,
        booking: {
          _id: booking._id,
          teacherName: `${booking.teacherId.firstName} ${booking.teacherId.lastName}`,
          subjectName: booking.subjectId.name,
          startTime: booking.startTime,
          endTime: booking.endTime,
          duration: booking.duration,
          totalAmount: booking.totalAmount,
          teacherAmount: booking.teacherAmount,
          platformCommission: booking.platformCommission
        }
      };
    } catch (stripeError) {
      console.error('Erreur Stripe:', stripeError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Payment Service Error',
        message: 'Erreur lors de la création du paiement'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la création du paiement'
    });
  }
});
