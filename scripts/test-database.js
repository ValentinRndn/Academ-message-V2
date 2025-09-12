/**
 * Script pour tester la connexion à MongoDB et afficher les informations sur la base de données
 * Usage: node scripts/test-database.js
 */

import { connectToDatabase, testDatabaseConnection, closeDatabaseConnection } from '../config/database.js';

async function main() {
  try {
    console.log('====== TEST DE CONNEXION À LA BASE DE DONNÉES ======');
    
    // Test de connexion
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      console.log('✅ La connexion à MongoDB est fonctionnelle!');
      
      // Obtenir la base de données
      const db = await connectToDatabase();
      
      // Afficher des informations sur les collections
      console.log('\nDonnées dans la base de données:');
      
      // Collections à vérifier
      const collections = ['User', 'Subject', 'Message', 'Booking', 'Availability', 'Review'];
      
      for (const collectionName of collections) {
        try {
          const count = await db.collection(collectionName).countDocuments();
          console.log(`- ${collectionName}: ${count} documents`);
          
          // Si la collection a des documents, afficher un exemple
          if (count > 0) {
            const sample = await db.collection(collectionName).findOne();
            console.log(`  Exemple (ID: ${sample._id}):`);
            
            // Filtrer les informations sensibles
            if (sample.password) {
              sample.password = '[PROTÉGÉ]';
            }
            
            // Afficher les premières propriétés
            const keys = Object.keys(sample).slice(0, 5);
            const preview = {};
            keys.forEach(key => {
              preview[key] = sample[key];
            });
            
            console.log('  ', preview, '...');
          }
        } catch (error) {
          console.log(`- ${collectionName}: Erreur de lecture (${error.message})`);
        }
      }
    } else {
      console.log('❌ Échec de la connexion à MongoDB');
      console.log('Veuillez vérifier que MongoDB est en cours d\'exécution et que l\'URL de connexion est correcte.');
    }
    
    // Fermer la connexion
    await closeDatabaseConnection();
    
  } catch (error) {
    console.error('Erreur lors du test de la base de données:', error);
  }
}

main().catch(console.error);
