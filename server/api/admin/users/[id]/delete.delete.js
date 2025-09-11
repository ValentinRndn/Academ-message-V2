import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Import dynamique du modèle Teacher
const getTeacherModel = async () => {
  const { default: Teacher } = await import('#/server/models/Teacher.js');
  return Teacher;
};

let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) return db;

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

    // Validation de l'ObjectId
    if (!ObjectId.isValid(userId)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID utilisateur invalide'
      });
    }

    const database = await connectToMongoDB();
    
    // Récupérer l'utilisateur à supprimer
    const userToDelete = await database.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
    
    if (!userToDelete) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur introuvable'
      });
    }

    // Empêcher la suppression de son propre compte admin
    if (userToDelete._id.toString() === event.context.auth.user._id.toString()) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Si c'est un professeur, supprimer aussi l'enregistrement Teacher
    if (userToDelete.role === 'teacher') {
      try {
        // S'assurer que Mongoose est connecté
        const config = useRuntimeConfig();
        const mongoUrl = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
        
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(mongoUrl);
          console.log('✅ Mongoose connecté pour suppression Teacher');
        }

        // Supprimer l'enregistrement Teacher correspondant
        const Teacher = await getTeacherModel();
        const teacherDeleted = await Teacher.findOneAndDelete({ userId: new ObjectId(userId) });
        if (teacherDeleted) {
          console.log(`✅ Teacher supprimé: ${teacherDeleted._id}`);
        }
      } catch (teacherError) {
        console.error('❌ Erreur lors de la suppression du Teacher:', teacherError);
        // On continue la suppression de l'utilisateur même si Teacher échoue
      }
    }

    // Supprimer l'utilisateur de la collection users
    const result = await database.collection('users').deleteOne({ 
      _id: new ObjectId(userId) 
    });

    if (result.deletedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de la suppression de l\'utilisateur'
      });
    }

    console.log(`✅ Utilisateur supprimé par l'admin ${event.context.auth.user.email}:`, {
      deletedUserId: userId,
      deletedUserEmail: userToDelete.email,
      deletedUserRole: userToDelete.role,
      deletedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Utilisateur ${userToDelete.firstName} ${userToDelete.lastName} supprimé avec succès`,
      deletedUser: {
        _id: userToDelete._id.toString(),
        firstName: userToDelete.firstName,
        lastName: userToDelete.lastName,
        email: userToDelete.email,
        role: userToDelete.role
      }
    };

  } catch (error) {
    console.error('Erreur détaillée lors de la suppression de l\'utilisateur:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de la suppression de l'utilisateur: ${error.message}`
    });
  }
});