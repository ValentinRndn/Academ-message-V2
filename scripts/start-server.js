/**
 * Script pour démarrer le serveur backend d'Academ
 */

import { exec } from 'child_process';
import { testDatabaseConnection } from '../config/database.js';

async function startServer() {
  try {
    console.log('🔄 Vérification de la connexion à la base de données...');
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à la base de données. Veuillez vérifier que MongoDB est en cours d\'exécution.');
      process.exit(1);
    }
    
    console.log('✅ Connexion à la base de données établie avec succès!');
    console.log('🚀 Démarrage du serveur...');
    
    const serverProcess = exec('node server/index.js');
    
    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    serverProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Le serveur s'est arrêté avec le code ${code}`);
      }
    });
    
    console.log('✅ Serveur démarré!');
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();
