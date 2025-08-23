import Conversation from '../../models/Conversation.js';
import { connectToDatabase } from '../../config/database.js';
import { connectToMongoDB } from '../../utils/mongodb.js';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    const db = await connectToMongoDB();
    
    // Vérifier que l'utilisateur est authentifié
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    const userId = new ObjectId(auth.user._id);
    const body = await readBody(event);
    const { participantId } = body;

    // Validation des données
    if (!participantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID du participant obligatoire'
      });
    }

    // Valider l'ID du participant
    if (!ObjectId.isValid(participantId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID du participant invalide'
      });
    }

    const participantObjectId = new ObjectId(participantId);

    // Vérifier que l'utilisateur ne démarre pas une conversation avec lui-même
    if (userId.toString() === participantObjectId.toString()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Vous ne pouvez pas démarrer une conversation avec vous-même'
      });
    }

    // Vérifier que le participant existe
    const participant = await db.collection('User').findOne({ _id: participantObjectId });
    if (!participant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Trouver ou créer une conversation entre les deux utilisateurs
    const conversation = await Conversation.findOrCreate(userId, participantObjectId);

    // Récupérer les informations de l'autre participant (sans le mot de passe)
    const otherParticipant = await db.collection('User').findOne(
      { _id: participantObjectId },
      { projection: { password: 0 } }
    );

    // Si la conversation a été supprimée par l'utilisateur, la restaurer
    if (conversation.deletedBy.some(del => del.userId.toString() === userId.toString())) {
      conversation.deletedBy = conversation.deletedBy.filter(
        del => del.userId.toString() !== userId.toString()
      );
      await conversation.save();
    }

    return {
      conversation: {
        _id: conversation._id,
        otherParticipant: otherParticipant,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      },
      isNewConversation: conversation.lastMessage === null
    };
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la création de la conversation'
    });
  }
});
