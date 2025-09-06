// API pour configurer le nouveau mot de passe et activer le compte
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import Teacher from '../../models/Teacher.js';

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
    const { email, tempPassword, newPassword, token } = body;

    // Validation des données
    if (!email || !tempPassword || !newPassword || !token) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Tous les champs sont requis'
      });
    }

    // Validation de la force du mot de passe
    if (newPassword.length < 8) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le mot de passe doit contenir au moins une majuscule'
      });
    }

    if (!/\d/.test(newPassword)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le mot de passe doit contenir au moins un chiffre'
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

    // Vérifier le mot de passe temporaire une dernière fois
    if (user.tempPassword !== tempPassword) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Mot de passe temporaire incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour l'utilisateur
    const updateResult = await database.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedNewPassword,
          status: 'active',
          accountActivated: true,
          emailVerified: true,
          isFirstLogin: false,
          updatedAt: new Date()
        },
        $unset: {
          tempPassword: '',
          resetPasswordToken: '',
          resetPasswordExpiry: ''
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de la mise à jour du mot de passe'
      });
    }

    // Si c'est un professeur, activer aussi le profil Teacher
    if (user.role === 'teacher') {
      try {
        // S'assurer que Mongoose est connecté
        const config = useRuntimeConfig();
        const mongoUrl = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
        
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(mongoUrl);
          console.log('✅ Mongoose connecté pour Teacher activation');
        }

        // Activer le profil Teacher
        const teacherResult = await Teacher.updateOne(
          { userId: user._id },
          {
            $set: {
              status: 'active',
              updatedAt: new Date()
            }
          }
        );

        if (teacherResult.modifiedCount > 0) {
          console.log('✅ Profil Teacher activé pour:', email);
        } else {
          console.warn('⚠️ Profil Teacher non trouvé pour:', email);
        }
      } catch (teacherError) {
        console.error('❌ Erreur lors de l\'activation du profil Teacher:', teacherError);
        // On continue même si l'activation du Teacher échoue
      }
    }

    console.log('✅ Compte activé avec succès pour:', {
      email: email,
      role: user.role,
      userId: user._id
    });

    return {
      success: true,
      message: 'Mot de passe configuré et compte activé avec succès',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: 'active'
      }
    };

  } catch (error) {
    console.error('Erreur lors de la configuration du mot de passe:', error);
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la configuration du mot de passe'
    });
  }
});