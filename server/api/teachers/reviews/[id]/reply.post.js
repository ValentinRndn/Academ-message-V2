import Review from '../../../../models/Review.js';
import { connectToDatabase } from '../../../../config/database.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
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

    // Seuls les professeurs peuvent répondre aux avis
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux professeurs'
      });
    }

    const reviewId = event.context.params.id;
    const body = await readBody(event);
    const { reply } = body;

    // Valider l'ID de l'avis
    if (!ObjectId.isValid(reviewId)) {
      throw createError({
        statusCode: 400,
        message: 'ID d\'avis invalide'
      });
    }

    // Valider la réponse
    if (!reply || reply.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'La réponse ne peut pas être vide'
      });
    }

    if (reply.length > 1000) {
      throw createError({
        statusCode: 400,
        message: 'La réponse ne peut pas dépasser 1000 caractères'
      });
    }

    // Vérifier que l'avis existe et appartient au professeur
    const review = await Review.findOne({
      _id: new ObjectId(reviewId),
      teacherId: new ObjectId(auth.user._id)
    });

    if (!review) {
      throw createError({
        statusCode: 404,
        message: 'Avis non trouvé ou non autorisé'
      });
    }

    // Vérifier que l'avis n'a pas déjà une réponse
    if (review.reply) {
      throw createError({
        statusCode: 400,
        message: 'Cet avis a déjà une réponse'
      });
    }

    // Mettre à jour l'avis avec la réponse
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        reply: reply.trim(),
        replyDate: new Date()
      },
      { new: true }
    ).populate('studentId', 'firstName lastName')
     .populate('bookingId', 'subject startTime duration');

    // Formater la réponse
    const formattedReview = {
      _id: updatedReview._id,
      rating: updatedReview.rating,
      comment: updatedReview.comment,
      tags: updatedReview.tags || [],
      createdAt: updatedReview.createdAt,
      reply: updatedReview.reply,
      replyDate: updatedReview.replyDate,
      studentId: updatedReview.studentId._id,
      studentName: `${updatedReview.studentId.firstName} ${updatedReview.studentId.lastName}`,
      subject: updatedReview.bookingId ? updatedReview.bookingId.subject : 'Matière non spécifiée',
      courseDate: updatedReview.bookingId ? updatedReview.bookingId.startTime : updatedReview.createdAt,
      duration: updatedReview.bookingId ? updatedReview.bookingId.duration : 1
    };

    return {
      message: 'Réponse ajoutée avec succès',
      review: formattedReview
    };

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réponse:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l\'ajout de la réponse'
    });
  }
});
