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

    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await Conversation.find({
      participants: userId,
      // Exclure les conversations supprimées par cet utilisateur
      'deletedBy.userId': { $ne: userId }
    })
    .populate({
      path: 'lastMessage',
      select: 'content type createdAt senderId'
    })
    .sort({ lastMessageAt: -1 });

    // Pour chaque conversation, récupérer les informations de l'autre participant
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.getOtherParticipant(userId);
        
        // Récupérer les infos de l'autre participant depuis la collection User
        const otherParticipant = await db.collection('User').findOne(
          { _id: otherParticipantId },
          { projection: { password: 0 } } // Exclure le mot de passe
        );

        // Compter les messages non lus dans cette conversation
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          receiverId: userId,
          read: false,
          deleted: false
        });

        // Vérifier si la conversation est archivée pour cet utilisateur
        const isArchived = conversation.archivedBy.some(
          archive => archive.userId.toString() === userId.toString()
        );

        return {
          _id: conversation._id,
          otherParticipant: otherParticipant,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount: unreadCount,
          isArchived: isArchived,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        };
      })
    );

    return {
      conversations: conversationsWithDetails,
      totalCount: conversationsWithDetails.length
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des conversations'
    });
  }
});
