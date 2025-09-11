// API pour vérifier si un utilisateur a une entrée dans la table teachers
import { MongoClient, ObjectId } from 'mongodb';

// Singleton pour maintenir la connexion à MongoDB
let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) {
    return db;
  }

  const config = useRuntimeConfig();
  const url = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  
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
        message: 'Authentication required'
      });
    }

    if (event.context.auth.user.role !== 'admin') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Access restricted to administrators'
      });
    }

    const userId = getRouterParam(event, 'id');
    if (!userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'User ID required'
      });
    }

    const database = await connectToMongoDB();
    const objectId = new ObjectId(userId);

    // Récupérer l'utilisateur
    const user = await database.collection('users').findOne({ _id: objectId });
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User not found'
      });
    }

    // Chercher l'entrée teacher correspondante
    const teacherEntry = await database.collection('teachers').findOne({ userId: objectId });

    return {
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
      },
      teacherEntry: teacherEntry ? {
        _id: teacherEntry._id,
        userId: teacherEntry.userId,
        firstName: teacherEntry.firstName,
        lastName: teacherEntry.lastName,
        email: teacherEntry.email,
        hourlyRate: teacherEntry.hourlyRate,
        status: teacherEntry.status,
        createdAt: teacherEntry.createdAt,
        updatedAt: teacherEntry.updatedAt
      } : null,
      hasTeacherEntry: !!teacherEntry,
      message: teacherEntry 
        ? 'User found with corresponding teacher entry' 
        : 'User found but no corresponding teacher entry'
    };

  } catch (error) {
    console.error('Error checking teacher entry:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Error during verification: ${error.message}`
    });
  }
});