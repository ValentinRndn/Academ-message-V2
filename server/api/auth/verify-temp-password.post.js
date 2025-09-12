// API pour vérifier le mot de passe temporaire
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

// Singleton pour MongoDB
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
    const body = await readBody(event);
    const { email, tempPassword, token } = body;

    // Validation des données
    if (!email || !tempPassword || !token) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Email, mot de passe temporaire et token sont requis'
      });
    }

    const database = await connectToMongoDB();

    // Rechercher l'utilisateur avec le token de réinitialisation
    const user = await database.collection('users').findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }, // Token non expiré
      accountActivated: false // Compte pas encore activé
    });

    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé ou lien de configuration expiré'
      });
    }

    // Vérifier si l'utilisateur a un mot de passe temporaire
    if (!user.tempPassword || !user.password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Aucun mot de passe temporaire trouvé pour cet utilisateur'
      });
    }

    // Vérifier que le mot de passe temporaire fourni correspond à celui stocké
    if (user.tempPassword !== tempPassword) {
      console.log('Tentative de mot de passe temporaire incorrect:', {
        email: email,
        provided: tempPassword,
        expected: user.tempPassword
      });
      
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Mot de passe temporaire incorrect'
      });
    }

    console.log('✅ Mot de passe temporaire vérifié avec succès pour:', email);

    return {
      success: true,
      message: 'Mot de passe temporaire vérifié avec succès',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };

  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe temporaire:', error);
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la vérification du mot de passe temporaire'
    });
  }
});