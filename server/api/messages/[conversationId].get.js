import Conversation from '../../models/Conversation.js';
import Message from '../../models/Message.js';
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
    const conversationId = getRouterParam(event, 'conversationId');

    // Valider l'ID de conversation
    if (!ObjectId.isValid(conversationId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de conversation invalide'
      });
    }

    // Récupérer la conversation et vérifier que l'utilisateur en fait partie
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Conversation non trouvée'
      });
    }

    if (!conversation.hasParticipant(userId)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé à cette conversation'
      });
    }

    // Paramètres de pagination
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const skip = (page - 1) * limit;

    // Récupérer les messages de la conversation avec pagination
    const messages = await Message.find({
      conversationId: new ObjectId(conversationId),
      deleted: false
    })
    .sort({ createdAt: -1 }) // Plus récents en premier pour la pagination
    .skip(skip)
    .limit(limit)
    .lean();

    // Inverser l'ordre pour afficher les plus anciens en premier dans l'UI
    messages.reverse();

    // Récupérer les informations des participants
    const otherParticipantId = conversation.getOtherParticipant(userId);
    const otherParticipant = await db.collection('users').findOne(
      { _id: otherParticipantId },
      { projection: { password: 0 } }
    );

    // Marquer tous les messages reçus dans cette conversation comme lus
    await Message.markConversationAsRead(new ObjectId(conversationId), userId);

    // Compter le total de messages
    const totalMessages = await Message.countDocuments({
      conversationId: new ObjectId(conversationId),
      deleted: false
    });

    return {
      conversation: {
        _id: conversation._id,
        otherParticipant: otherParticipant,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      },
      messages: messages,
      pagination: {
        page: page,
        limit: limit,
        totalMessages: totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasMore: page * limit < totalMessages
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des messages'
    });
  }
});
