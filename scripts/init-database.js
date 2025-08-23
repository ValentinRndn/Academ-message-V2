import { connectToDatabase } from '../config/database.js';
import { hashPassword } from '../server/utils/password.js';

async function initializeDatabase() {
  try {
    const db = await connectToDatabase();
    
    // Créer la collection users si elle n'existe pas
    const usersCollection = db.collection('User');
    
    // Supprimer les utilisateurs existants
    await usersCollection.deleteMany({});
    
    // Créer les utilisateurs de test
    const users = [
      {
        email: 'john@example.com',
        password: await hashPassword('student123'),
        role: 'student',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'admin@academ.com',
        password: await hashPassword('admin123'),
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'robert@example.com',
        password: await hashPassword('teacher123'),
        role: 'teacher',
        firstName: 'Robert',
        lastName: 'Smith',
        subjects: ['Mathématiques', 'Physique'],
        availability: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insérer les utilisateurs
    const result = await usersCollection.insertMany(users);
    console.log(`${result.insertedCount} utilisateurs créés avec succès`);

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    process.exit();
  }
}

initializeDatabase();
