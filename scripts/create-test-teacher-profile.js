import { connectToDatabase } from '../server/config/database.js';
import Teacher from '../server/models/Teacher.js';
import { findUsers } from '../server/models/userModel.js';

async function createTestTeacherProfiles() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    console.log('✅ Connexion établie');

    // Récupérer tous les utilisateurs professeurs
    console.log('👨‍🏫 Récupération des professeurs...');
    const teachers = await findUsers({ role: 'teacher' });
    console.log(`📊 ${teachers.length} professeurs trouvés`);

    if (teachers.length === 0) {
      console.log('❌ Aucun professeur trouvé. Créez d\'abord des utilisateurs professeurs.');
      return;
    }

    // Données de test pour les profils
    const testProfiles = [
      {
        bio: "Professeur passionné de mathématiques avec plus de 8 ans d'expérience. J'aime rendre les mathématiques accessibles et amusantes pour tous les niveaux. Spécialisé en algèbre, géométrie et calcul différentiel.",
        hourlyRate: 45,
        languages: ['french', 'english'],
        experience: 8,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        bio: "Enseignante en sciences avec une approche pratique et expérimentale. J'encourage mes étudiants à développer leur esprit critique et leur curiosité scientifique. Cours de physique, chimie et biologie.",
        hourlyRate: 50,
        languages: ['french', 'english', 'spanish'],
        experience: 12,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        bio: "Professeur de langues polyglotte avec une méthode d'apprentissage interactive. Je privilégie la conversation et l'immersion culturelle pour un apprentissage efficace et naturel.",
        hourlyRate: 40,
        languages: ['french', 'english', 'german', 'italian'],
        experience: 6,
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      {
        bio: "Enseignant en informatique spécialisé dans la programmation et le développement web. J'aide mes étudiants à maîtriser les technologies modernes avec des projets pratiques.",
        hourlyRate: 55,
        languages: ['french', 'english'],
        experience: 10,
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
      },
      {
        bio: "Professeur d'histoire et géographie passionné par la transmission du savoir. J'utilise des méthodes pédagogiques variées pour rendre l'histoire vivante et accessible.",
        hourlyRate: 35,
        languages: ['french', 'english'],
        experience: 15,
        avatar: 'https://randomuser.me/api/portraits/men/89.jpg'
      }
    ];

    let updatedCount = 0;
    let createdCount = 0;

    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      const testProfile = testProfiles[i % testProfiles.length];

      try {
        // Vérifier si un profil Teacher existe déjà
        let teacherProfile = await Teacher.findOne({ userId: teacher._id });

        if (teacherProfile) {
          // Mettre à jour le profil existant
          console.log(`🔄 Mise à jour du profil pour ${teacher.firstName} ${teacher.lastName}...`);
          
          teacherProfile.bio = testProfile.bio;
          teacherProfile.hourlyRate = testProfile.hourlyRate;
          teacherProfile.languages = testProfile.languages;
          teacherProfile.experience = testProfile.experience;
          teacherProfile.avatar = testProfile.avatar;
          
          await teacherProfile.save();
          updatedCount++;
          console.log(`✅ Profil mis à jour pour ${teacher.firstName} ${teacher.lastName}`);
        } else {
          // Créer un nouveau profil
          console.log(`🆕 Création du profil pour ${teacher.firstName} ${teacher.lastName}...`);
          
          const newTeacherProfile = new Teacher({
            userId: teacher._id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            bio: testProfile.bio,
            hourlyRate: testProfile.hourlyRate,
            languages: testProfile.languages,
            experience: testProfile.experience,
            avatar: testProfile.avatar,
            subjects: [], // Sera rempli plus tard
            availability: [], // Sera rempli plus tard
            averageRating: 0,
            reviewCount: 0,
            sessionsCompleted: 0,
            status: 'active'
          });
          
          await newTeacherProfile.save();
          createdCount++;
          console.log(`✅ Profil créé pour ${teacher.firstName} ${teacher.lastName}`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${teacher.firstName} ${teacher.lastName}:`, error.message);
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`✅ ${createdCount} profils créés`);
    console.log(`🔄 ${updatedCount} profils mis à jour`);
    console.log(`📈 Total: ${createdCount + updatedCount} profils traités`);

    // Afficher quelques statistiques
    const totalTeachers = await Teacher.countDocuments();
    console.log(`\n📈 Nombre total de profils Teacher dans la base: ${totalTeachers}`);

    // Afficher quelques exemples de profils créés
    const sampleProfiles = await Teacher.find().limit(3);
    console.log('\n👥 Exemples de profils:');
    sampleProfiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.firstName} ${profile.lastName} - ${profile.hourlyRate}€/h - ${profile.experience} ans d'expérience`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des profils de test:', error);
  } finally {
    console.log('\n🏁 Script terminé');
    process.exit(0);
  }
}

// Exécuter le script
createTestTeacherProfiles();
