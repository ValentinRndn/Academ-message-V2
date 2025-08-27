// API pour modifier le statut d'un utilisateur (admin seulement)
import { MongoClient } from 'mongodb';

// Singleton pour maintenir la connexion à MongoDB
let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) {
    return db;
  }

  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  
  try {
    if (!client) {
      client = new MongoClient(url);
      await client.connect();
      console.log('Connexion à MongoDB établie');
    }
    
    db = client.db();
    return db;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

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
    const body = await readBody(event);
    const { status } = body;

    // Validation du statut
    const validStatuses = ['active', 'inactive', 'pending'];
    if (!validStatuses.includes(status)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Statut invalide'
      });
    }

    const database = await connectToMongoDB();

    // Vérifier que l'utilisateur existe
    const user = await database.collection('User').findOne({ _id: userId });
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher l'admin de se désactiver lui-même
    if (user._id.toString() === event.context.auth.user._id.toString()) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Vous ne pouvez pas modifier votre propre statut'
      });
    }

    // Mettre à jour le statut
    const result = await database.collection('User').updateOne(
      { _id: userId },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    console.log(`✅ Statut utilisateur modifié par l'admin ${event.context.auth.user.email}:`, {
      userId: userId,
      oldStatus: user.status,
      newStatus: status,
      modifiedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Statut de l'utilisateur mis à jour vers ${status}`,
      userId: userId,
      newStatus: status
    };

  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la modification du statut'
    });
  }
});
