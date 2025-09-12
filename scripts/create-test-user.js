import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function createTestUser() {
  let client;
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Utilisateur de test
    const testUser = {
      email: "admin@academ.com",
      password: "$2b$10$qj9oWp5v7xA25ZHrVXhSOeFzME4r8tyIRO42uw3Yp5rc1WC86Oa0S", // admin123
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('📝 Vérification si l\'utilisateur existe déjà...');
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    
    if (false) {
      console.log('⚠️ L\'utilisateur existe déjà');
      return;
    }
    
    console.log('➕ Création de l\'utilisateur de test...');
    const result = await usersCollection.insertOne(testUser);
    
    console.log(`✅ Utilisateur créé avec succès ! ID: ${result.insertedId}`);
    console.log('📋 Identifiants de connexion :');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Mot de passe: admin123`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connexion fermée');
    }
  }
}

createTestUser();
