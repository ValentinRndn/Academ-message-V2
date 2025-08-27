// API pour récupérer toutes les matières
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
    console.log('Tentative de récupération des matières...');
    
    const database = await connectToMongoDB();
    const subjects = await database.collection('Subject').find({}).sort({ name: 1 }).toArray();
    
    console.log('Matières récupérées:', subjects.length);
    
    return {
      subjects,
      totalCount: subjects.length
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des matières'
    });
  }
});
