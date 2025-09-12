    // Script pour vérifier les variables d'environnement
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Vérification des variables d\'environnement...\n');

const requiredVars = [
  'DATABASE_URL',
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'BASE_URL'
];

console.log('Variables requises :');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Masquer les mots de passe
    if (varName.includes('PASS')) {
      console.log(`✅ ${varName}: ${'*'.repeat(Math.min(value.length, 8))}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NON DÉFINIE`);
  }
});

console.log('\n📋 Configuration recommandée pour .env :');
console.log(`
# Configuration de la base de données
DATABASE_URL=mongodb://localhost:27017/academ-message-db

# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
SMTP_FROM=noreply@academ-message.com

# URL de base de l'application
BASE_URL=http://localhost:3001
`);

// Vérifier si le fichier .env existe
const envPath = path.join(path.dirname(__dirname), '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ Fichier .env trouvé');
} else {
  console.log('❌ Fichier .env non trouvé');
  console.log('📝 Créez un fichier .env à la racine du projet avec la configuration ci-dessus');
}
