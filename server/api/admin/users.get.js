// API pour récupérer la liste des utilisateurs (admin seulement)
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

    const database = await connectToMongoDB();

    // Récupérer tous les utilisateurs (sans les mots de passe)
    const users = await database.collection('User').find(
      {},
      { 
        projection: { 
          password: 0,
          __v: 0
        } 
      }
    ).sort({ createdAt: -1 }).toArray();

    // Calculer les statistiques
    const stats = {
      totalUsers: users.length,
      totalTeachers: users.filter(user => user.role === 'teacher').length,
      totalStudents: users.filter(user => user.role === 'student').length,
      totalAdmins: users.filter(user => user.role === 'admin').length,
      pendingUsers: users.filter(user => user.status === 'pending').length,
      activeUsers: users.filter(user => user.status === 'active').length,
      inactiveUsers: users.filter(user => user.status === 'inactive').length
    };

    // Formater les données des utilisateurs
    const formattedUsers = users.map(user => ({
      _id: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'student',
      status: user.status || 'active',
      phone: user.phone || '',
      specialization: user.specialization || '',
      experience: user.experience || 0,
      bio: user.bio || '',
      subjects: user.subjects || [],
      avatar: user.avatar || '',
      isFirstLogin: user.isFirstLogin || false,
      emailVerified: user.emailVerified || false,
      profileCompleted: user.profileCompleted || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    }));

    return {
      users: formattedUsers,
      stats: stats
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});
