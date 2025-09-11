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
    
    // Récupérer l'utilisateur (sans le mot de passe)
    const user = await database.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0, tempPassword: 0, resetPasswordToken: 0 } }
    );
    
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur introuvable'
      });
    }

    let teacherDetails = null;
    
    // Si c'est un professeur, récupérer aussi les détails Teacher
    if (user.role === 'teacher') {
      try {
        // S'assurer que Mongoose est connecté
        const config = useRuntimeConfig();
        const mongoUrl = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
        
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(mongoUrl);
          console.log('✅ Mongoose connecté pour récupération Teacher');
        }

        const Teacher = await getTeacherModel();
        teacherDetails = await Teacher.findOne({ userId: new ObjectId(userId) });
      } catch (teacherError) {
        console.error('❌ Erreur lors de la récupération des détails Teacher:', teacherError);
        // On continue sans les détails Teacher
      }
    }

    // Calculer des statistiques pour l'utilisateur
    const stats = {
      accountAge: user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0,
      lastLoginAgo: user.lastLogin ? Math.floor((new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)) : null,
      isNewUser: user.createdAt ? (new Date() - new Date(user.createdAt)) < (7 * 24 * 60 * 60 * 1000) : false, // Moins de 7 jours
      hasEverLoggedIn: !!user.lastLogin
    };

    return {
      success: true,
      user: {
        ...user,
        _id: user._id.toString()
      },
      teacherDetails: teacherDetails ? {
        ...teacherDetails.toObject(),
        _id: teacherDetails._id.toString(),
        userId: teacherDetails.userId.toString()
      } : null,
      stats
    };

  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des détails utilisateur:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de la récupération des détails: ${error.message}`
    });
  }
});