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

    const senderId = new ObjectId(auth.user._id);
    const body = await readBody(event);
    const { receiverId, content, conversationId } = body;

    // Validation des données
    if (!content || content.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le contenu du message est obligatoire'
      });
    }

    if (content.length > 2000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le message est trop long (maximum 2000 caractères)'
      });
    }

    if (!receiverId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID du destinataire obligatoire'
      });
    }

    // Valider l'ID du destinataire
    if (!ObjectId.isValid(receiverId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID du destinataire invalide'
      });
    }

    const receiverObjectId = new ObjectId(receiverId);

    // Vérifier que le destinataire existe
    const receiver = await db.collection('users').findOne({ _id: receiverObjectId });
    if (!receiver) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Destinataire non trouvé'
      });
    }

    // Vérifier que l'utilisateur ne s'envoie pas un message à lui-même
    if (senderId.toString() === receiverObjectId.toString()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Vous ne pouvez pas vous envoyer un message à vous-même'
      });
    }

    let conversation;

    // Si un ID de conversation est fourni, vérifier qu'elle existe et que l'utilisateur en fait partie
    if (conversationId) {
      if (!ObjectId.isValid(conversationId)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'ID de conversation invalide'
        });
      }

      conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'Conversation non trouvée'
        });
      }

      if (!conversation.hasParticipant(senderId)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'Accès non autorisé à cette conversation'
        });
      }
    } else {
      // Trouver ou créer une conversation entre les deux utilisateurs
      conversation = await Conversation.findOrCreate(senderId, receiverObjectId);
    }

    // Créer le message
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverObjectId,
      content: content.trim(),
      type: 'text',
      conversationId: conversation._id,
      read: false
    });

    await newMessage.save();

    // Mettre à jour la conversation avec le dernier message
    await conversation.updateLastMessage(newMessage._id);

    // Populer les informations du sender pour la réponse
    const sender = await db.collection('users').findOne(
      { _id: senderId },
      { projection: { password: 0 } }
    );

    // Réponse avec le message créé
    const messageResponse = {
      _id: newMessage._id,
      senderId: senderId,
      receiverId: receiverObjectId,
      content: newMessage.content,
      type: newMessage.type,
      read: newMessage.read,
      conversationId: conversation._id,
      sender: sender,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt
    };

    return {
      message: messageResponse,
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
        lastMessageAt: conversation.lastMessageAt
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});
