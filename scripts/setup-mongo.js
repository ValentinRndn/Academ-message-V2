/**
 * Script pour configurer MongoDB et générer le client Prisma
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Vérifier si le fichier .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('Création du fichier .env...');
  // Copier depuis .env.example s'il existe, sinon créer un nouveau
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
  } else {
    fs.writeFileSync(envPath, 'DATABASE_URL="mongodb://localhost:27017/academ-message-db"\nJWT_SECRET="votre-secret-jwt-securise"');
  }
  console.log('Fichier .env créé avec succès!');
}

// Générer le client Prisma
console.log('Génération du client Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Client Prisma généré avec succès!');
} catch (error) {
  console.error('Erreur lors de la génération du client Prisma:', error);
  process.exit(1);
}

// Vérifier si MongoDB est en cours d'exécution
console.log('Vérification de la connexion MongoDB...');
try {
  const { MongoClient } = require('mongodb');
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  
  const client = new MongoClient(url);
  client.connect()
    .then(() => {
      console.log('✅ Connexion à MongoDB établie avec succès!');
      client.close();
      
      // Si la connexion est réussie, exécuter la commande pour initialiser la base de données
      console.log('Voulez-vous initialiser la base de données avec des données de démonstration? (Y/n)');
      process.stdin.once('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        if (input === '' || input === 'y' || input === 'yes') {
          try {
            console.log('Initialisation de la base de données...');
            execSync('node scripts/init-mongodb.js', { stdio: 'inherit' });
            console.log('✅ Base de données initialisée avec succès!');
          } catch (error) {
            console.error('Erreur lors de l\'initialisation de la base de données:', error);
          }
        }
        process.exit(0);
      });
    })
    .catch((err) => {
      console.error('❌ Erreur de connexion à MongoDB:', err);
      console.error('Veuillez vérifier que MongoDB est en cours d\'exécution et que l\'URL de connexion est correcte.');
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Erreur lors de la vérification de MongoDB:', error);
  process.exit(1);
}