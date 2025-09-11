// API pour approuver un professeur en attente
import { updateUser, findUserById } from '../../../models/userModel.js';
import { sendApprovalConfirmationEmail } from '../../../utils/email.js';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification et le rôle admin
    if (!event.context.auth?.user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    if (event.context.auth.user.role !== 'admin') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux administrateurs'
      });
    }

    const userId = getRouterParam(event, 'id');
    if (!userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID utilisateur requis'
      });
    }

    // Récupérer l'utilisateur
    const user = await findUserById(userId);
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que c'est un professeur en attente
    if (user.role !== 'teacher') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Seuls les professeurs peuvent être approuvés'
      });
    }

    if (user.status !== 'pending') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cet utilisateur n\'est pas en attente d\'approbation'
      });
    }

    // Mettre à jour le statut à "active"
    const updateResult = await updateUser(userId, {
      status: 'active',
      approvedAt: new Date(),
      approvedBy: event.context.auth.user._id
    });

    if (updateResult.modifiedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de l\'approbation de l\'utilisateur'
      });
    }

    // Envoyer l'email de confirmation d'approbation
    try {
      const config = useRuntimeConfig();
      await sendApprovalConfirmationEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loginUrl: `${config.baseUrl || 'https://academ.my'}/login`
      });
      console.log('✅ Email d\'approbation envoyé à:', user.email);
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email d\'approbation:', emailError);
      // On continue même si l'email échoue
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await findUserById(userId);

    console.log(`✅ Professeur approuvé par l'admin ${event.context.auth.user.email}:`, {
      userId: userId,
      teacherEmail: user.email,
      approvedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Le professeur ${user.firstName} ${user.lastName} a été approuvé avec succès`,
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        approvedAt: updatedUser.approvedAt
      }
    };

  } catch (error) {
    console.error('Erreur lors de l\'approbation du professeur:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de l\'approbation: ${error.message}`
    });
  }
});