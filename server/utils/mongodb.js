// Utilitaire pour la connexion à MongoDB
import { MongoClient } from 'mongodb';

// Singleton pour maintenir la connexion à MongoDB
let client = null;
let db = null;

/**
 * Se connecte à MongoDB et retourne l'instance de la base de données
 * @returns {Promise<Db>} L'instance de la base de données MongoDB
 */
export async function connectToMongoDB() {
  if (db) {
    return db;
  }

  // Récupérer l'URL de connexion depuis la configuration Nuxt
  const config = useRuntimeConfig();
  const url = config.DATABASE_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  console.log('🔍 MongoDB URL utilisée:', url);
  
  try {
    if (!client) {
      client = new MongoClient(url);
      await client.connect();
      console.log('Connexion à MongoDB établie');
    }
    
    db = client.db();
    console.log('🔍 Base de données connectée:', db.databaseName);
    return db;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

/**
 * Ferme la connexion à MongoDB
 */
export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Connexion à MongoDB fermée');
  }
}

/**
 * Vérifie la connexion à MongoDB
 * @returns {Promise<boolean>} true si la connexion est réussie
 */
export async function testMongoDBConnection() {
  try {
    const database = await connectToMongoDB();
    await database.command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('Erreur lors du test de connexion à MongoDB:', error);
    return false;
  }
}

// Gestionnaire pour la fermeture de la connexion lors de l'arrêt du serveur
process.on('SIGINT', async () => {
  await closeMongoDB();
  process.exit(0);
});

export default { connectToMongoDB, closeMongoDB, testMongoDBConnection };
