/**
 * Configuration de la connexion à la base de données MongoDB
 */

import { MongoClient } from 'mongodb';

// URL de connexion MongoDB
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';

// Création d'une instance du client MongoDB
const client = new MongoClient(DATABASE_URL);

// Variable pour stocker la connexion à la base de données
let dbConnection = null;

/**
 * Établit une connexion à la base de données MongoDB
 * @returns {Promise<Db>} L'instance de la base de données
 */
export async function connectToDatabase() {
  try {
    // Si une connexion existe déjà, la renvoyer
    if (dbConnection) {
      return dbConnection;
    }
    
    // Établir une nouvelle connexion
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    // Obtenir la base de données
    dbConnection = client.db();
    console.log('Connected to MongoDB successfully');
    
    return dbConnection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Ferme la connexion à la base de données
 */
export async function closeDatabaseConnection() {
  try {
    if (client) {
      await client.close();
      dbConnection = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

/**
 * Teste la connexion à la base de données et affiche les informations sur les collections
 * @returns {Promise<boolean>} true si la connexion est réussie, false sinon
 */
export async function testDatabaseConnection() {
  try {
    const db = await connectToDatabase();
    
    // Vérifier si la base de données est disponible
    const collections = await db.listCollections().toArray();
    console.log(`Connection successful! Found ${collections.length} collections.`);
    
    // Liste des collections
    console.log('Collections:');
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
    }
    
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Exporter le client MongoDb pour une utilisation dans d'autres fichiers
export { client };
