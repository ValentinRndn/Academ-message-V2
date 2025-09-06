import mongoose from 'mongoose';
import { connectToDatabase } from '../server/config/database.js';
import { connectToMongoDB } from '../server/utils/mongodb.js';
import Teacher from '../server/models/Teacher.js';
import { hashPassword } from '../server/utils/password.js';

async function createMissingUsers() {
  try {
    // Connexion aux bases de données
    await connectToDatabase(); // Mongoose
    const db = await connectToMongoDB(); // MongoDB client

    console.log('Connexion établie, recherche des profils Teacher orphelins...');

    // Trouver tous les profils Teacher sans userId
    const orphanedTeachers = await Teacher.find({ 
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    console.log(`${orphanedTeachers.length} profils Teacher orphelins trouvés`);

    for (const teacher of orphanedTeachers) {
      // Vérifier si un utilisateur avec cet email existe déjà
      const existingUser = await db.collection('users').findOne({ email: teacher.email });

      if (existingUser) {
        // Lier le profil à l'utilisateur existant
        teacher.userId = existingUser._id;
        await teacher.save();
        console.log(`✓ Profil lié à l'utilisateur existant: ${teacher.email}`);
      } else {
        // Créer un nouvel utilisateur pour ce profil Teacher
        const newUser = {
          email: teacher.email,
          password: await hashPassword('teacher123'), // Mot de passe par défaut
          role: 'teacher',
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        
        // Lier le profil Teacher au nouvel utilisateur
        teacher.userId = result.insertedId;
        await teacher.save();
        
        console.log(`✓ Nouvel utilisateur créé et lié: ${teacher.email} (mot de passe: teacher123)`);
      }
    }

    console.log('\n✅ Création des utilisateurs manquants terminée !');
    
    // Afficher un résumé final
    const totalTeachers = await Teacher.countDocuments({});
    const linkedTeachers = await Teacher.countDocuments({ userId: { $exists: true, $ne: null } });
    
    console.log(`\n📊 Résumé final:`);
    console.log(`- Total profils Teacher: ${totalTeachers}`);
    console.log(`- Profils liés: ${linkedTeachers}`);
    console.log(`- Profils orphelins restants: ${totalTeachers - linkedTeachers}`);

    if (linkedTeachers === totalTeachers) {
      console.log('\n🎉 Tous les profils Teacher sont maintenant liés à des utilisateurs !');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de la base de données.');
  }
}

createMissingUsers();
