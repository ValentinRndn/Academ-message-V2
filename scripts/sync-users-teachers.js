import mongoose from 'mongoose';
import { connectToDatabase } from '../server/config/database.js';
import { connectToMongoDB } from '../server/utils/mongodb.js';
import Teacher from '../server/models/Teacher.js';
import { ObjectId } from 'mongodb';

async function syncUsersTeachers() {
  try {
    // Connexion aux bases de données
    await connectToDatabase(); // Mongoose
    const db = await connectToMongoDB(); // MongoDB client

    console.log('Connexion établie, début de la synchronisation...');

    // Récupérer tous les utilisateurs avec le rôle 'teacher'
    const userTeachers = await db.collection('User').find({ role: 'teacher' }).toArray();
    console.log(`${userTeachers.length} utilisateurs professeurs trouvés`);

    // Récupérer tous les profils Teacher existants
    const teacherProfiles = await Teacher.find({});
    console.log(`${teacherProfiles.length} profils Teacher existants`);

    for (const userTeacher of userTeachers) {
      // Vérifier si un profil Teacher existe déjà pour cet utilisateur
      const existingProfile = teacherProfiles.find(
        teacher => teacher.email === userTeacher.email
      );

      if (existingProfile) {
        // Lier le profil existant à l'utilisateur
        if (!existingProfile.userId) {
          existingProfile.userId = userTeacher._id;
          await existingProfile.save();
          console.log(`✓ Profil Teacher lié pour ${userTeacher.email}`);
        } else {
          console.log(`- Profil Teacher déjà lié pour ${userTeacher.email}`);
        }
      } else {
        // Créer un nouveau profil Teacher basique pour cet utilisateur
        const newTeacherProfile = new Teacher({
          userId: userTeacher._id,
          firstName: userTeacher.firstName,
          lastName: userTeacher.lastName,
          email: userTeacher.email,
          bio: `Professeur expérimenté dans les matières enseignées.`,
          subjects: [], // À remplir plus tard
          availability: [],
          hourlyRate: 25, // Tarif par défaut
          languages: ['french', 'english'],
          experience: Math.floor(Math.random() * 10) + 1,
          status: userTeacher.status || 'active'
        });

        await newTeacherProfile.save();
        console.log(`✓ Nouveau profil Teacher créé pour ${userTeacher.email}`);
      }
    }

    // Nettoyer les profils Teacher orphelins (sans userId)
    const orphanedProfiles = await Teacher.find({ userId: { $exists: false } });
    if (orphanedProfiles.length > 0) {
      console.log(`\n${orphanedProfiles.length} profils Teacher orphelins détectés:`);
      
      for (const orphan of orphanedProfiles) {
        // Essayer de trouver un utilisateur correspondant par email
        const matchingUser = await db.collection('User').findOne({ 
          email: orphan.email,
          role: 'teacher'
        });

        if (matchingUser) {
          orphan.userId = matchingUser._id;
          await orphan.save();
          console.log(`✓ Profil orphelin lié pour ${orphan.email}`);
        } else {
          console.log(`⚠ Profil orphelin sans utilisateur correspondant: ${orphan.email}`);
          // Option : supprimer ou marquer comme inactif
          // await Teacher.findByIdAndDelete(orphan._id);
        }
      }
    }

    console.log('\n✅ Synchronisation terminée avec succès !');
    
    // Afficher un résumé
    const finalTeacherCount = await Teacher.countDocuments({});
    const linkedTeacherCount = await Teacher.countDocuments({ userId: { $exists: true } });
    
    console.log(`\n📊 Résumé:`);
    console.log(`- Total profils Teacher: ${finalTeacherCount}`);
    console.log(`- Profils liés à des utilisateurs: ${linkedTeacherCount}`);
    console.log(`- Profils non liés: ${finalTeacherCount - linkedTeacherCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de la base de données.');
  }
}

syncUsersTeachers();
