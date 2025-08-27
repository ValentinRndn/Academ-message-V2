import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

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
    // Vérifier l'authentification
    if (!event.context.auth?.user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    const body = await readBody(event);
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validation des données
    if (!currentPassword || !newPassword || !confirmPassword) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Les nouveaux mots de passe ne correspondent pas'
      });
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 6) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const database = await connectToMongoDB();

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await database.collection('User').findOne({ 
      _id: event.context.auth.user._id 
    });

    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe dans la base de données
    await database.collection('User').updateOne(
      { _id: event.context.auth.user._id },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date(),
          isFirstLogin: false // L'utilisateur a changé son mot de passe
        } 
      }
    );

    console.log(`✅ Mot de passe changé pour l'utilisateur ${event.context.auth.user.email}`);

    return {
      success: true,
      message: 'Mot de passe changé avec succès'
    };

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors du changement de mot de passe'
    });
  }
});
