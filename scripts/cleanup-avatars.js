import { connectToDatabase } from '../server/config/database.js';
import { findUsers } from '../server/models/userModel.js';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function cleanupAvatars() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    console.log('✅ Connexion établie');

    // Récupérer tous les avatars utilisés dans la base de données
    console.log('👥 Récupération des avatars utilisés...');
    const users = await findUsers({});
    const usedAvatars = new Set();
    
    users.forEach(user => {
      if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        usedAvatars.add(user.avatar);
      }
    });
    
    console.log(`📊 ${usedAvatars.size} avatars utilisés trouvés`);

    // Lire le dossier des avatars
    const avatarsDir = join(__dirname, '../public/uploads/avatars');
    const files = await readdir(avatarsDir);
    
    console.log(`📁 ${files.length} fichiers trouvés dans le dossier avatars`);

    let deletedCount = 0;
    let errorCount = 0;

    // Vérifier chaque fichier
    for (const file of files) {
      const filePath = join(avatarsDir, file);
      const avatarUrl = `/uploads/avatars/${file}`;
      
      try {
        // Vérifier si le fichier est utilisé
        if (!usedAvatars.has(avatarUrl)) {
          // Vérifier l'âge du fichier (supprimer après 30 jours)
          const fileStats = await stat(filePath);
          const fileAge = Date.now() - fileStats.mtime.getTime();
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          
          if (fileAge > thirtyDays) {
            await unlink(filePath);
            deletedCount++;
            console.log(`🗑️ Supprimé: ${file} (non utilisé depuis ${Math.floor(fileAge / (24 * 60 * 60 * 1000))} jours)`);
          } else {
            console.log(`⏳ Gardé: ${file} (trop récent, ${Math.floor(fileAge / (24 * 60 * 60 * 1000))} jours)`);
          }
        } else {
          console.log(`✅ Utilisé: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Erreur avec ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Résumé du nettoyage:');
    console.log(`🗑️ ${deletedCount} fichiers supprimés`);
    console.log(`❌ ${errorCount} erreurs`);
    console.log(`✅ ${files.length - deletedCount - errorCount} fichiers conservés`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des avatars:', error);
  } finally {
    console.log('\n🏁 Script terminé');
    process.exit(0);
  }
}

// Exécuter le script
cleanupAvatars();
