import { connectToDatabase } from '../server/config/database.js';
import { findUsers, updateUser } from '../server/models/userModel.js';

async function createTestStudentProfiles() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    console.log('✅ Connexion établie');

    // Récupérer tous les utilisateurs étudiants
    console.log('👨‍🎓 Récupération des étudiants...');
    const students = await findUsers({ role: 'student' });
    console.log(`📊 ${students.length} étudiants trouvés`);

    if (students.length === 0) {
      console.log('❌ Aucun étudiant trouvé. Créez d\'abord des utilisateurs étudiants.');
      return;
    }

    // Données de test pour les profils étudiants
    const testProfiles = [
      {
        phone: '+33 6 12 34 56 78',
        educationLevel: 'high_school',
        subjectsOfInterest: [], // Sera rempli avec des IDs de matières
        learningGoals: 'Améliorer mes notes en mathématiques et sciences pour préparer mon bac scientifique.',
        preferredTimeSlots: ['afternoon', 'evening'],
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
      },
      {
        phone: '+33 6 98 76 54 32',
        educationLevel: 'bachelor',
        subjectsOfInterest: [],
        learningGoals: 'Approfondir mes connaissances en informatique et développement web pour mon stage.',
        preferredTimeSlots: ['evening'],
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      {
        phone: '+33 7 11 22 33 44',
        educationLevel: 'middle_school',
        subjectsOfInterest: [],
        learningGoals: 'Rattraper mon retard en français et en histoire-géographie.',
        preferredTimeSlots: ['afternoon'],
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
      },
      {
        phone: '+33 6 55 66 77 88',
        educationLevel: 'master',
        subjectsOfInterest: [],
        learningGoals: 'Perfectionner mon anglais pour mes études à l\'étranger et mes projets professionnels.',
        preferredTimeSlots: ['morning', 'afternoon'],
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
      },
      {
        phone: '+33 7 99 88 77 66',
        educationLevel: 'high_school',
        subjectsOfInterest: [],
        learningGoals: 'Comprendre mieux la physique-chimie et me préparer pour les études d\'ingénieur.',
        preferredTimeSlots: ['afternoon', 'evening'],
        avatar: 'https://randomuser.me/api/portraits/men/95.jpg'
      }
    ];

    // Récupérer quelques matières pour les assigner aléatoirement
    const Subject = await import('../server/models/Subject.js').then(m => m.default);
    const subjects = await Subject.find().limit(5);
    
    console.log(`📚 ${subjects.length} matières disponibles pour assignation`);

    let updatedCount = 0;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const testProfile = testProfiles[i % testProfiles.length];

      try {
        // Assigner 1-3 matières aléatoirement
        const numSubjects = Math.floor(Math.random() * 3) + 1;
        const selectedSubjects = [];
        
        for (let j = 0; j < numSubjects && j < subjects.length; j++) {
          const randomIndex = Math.floor(Math.random() * subjects.length);
          const subject = subjects[randomIndex];
          if (!selectedSubjects.includes(subject._id.toString())) {
            selectedSubjects.push(subject._id.toString());
          }
        }

        // Préparer les données de mise à jour
        const updateData = {
          ...testProfile,
          subjectsOfInterest: selectedSubjects,
          updatedAt: new Date()
        };

        // Mettre à jour le profil de l'étudiant
        console.log(`🔄 Mise à jour du profil pour ${student.firstName} ${student.lastName}...`);
        
        const updatedStudent = await updateUser(student._id, updateData);
        
        if (updatedStudent) {
          updatedCount++;
          console.log(`✅ Profil mis à jour pour ${student.firstName} ${student.lastName}`);
          console.log(`   📱 Téléphone: ${updateData.phone}`);
          console.log(`   🎓 Niveau: ${updateData.educationLevel}`);
          console.log(`   📚 Matières: ${selectedSubjects.length} matière(s)`);
          console.log(`   🎯 Objectifs: ${updateData.learningGoals.substring(0, 50)}...`);
        } else {
          console.log(`❌ Échec de la mise à jour pour ${student.firstName} ${student.lastName}`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${student.firstName} ${student.lastName}:`, error.message);
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`🔄 ${updatedCount} profils mis à jour`);
    console.log(`📈 Total: ${updatedCount} profils traités`);

    // Afficher quelques exemples de profils mis à jour
    const updatedStudents = await findUsers({ role: 'student' });
    console.log('\n👥 Exemples de profils mis à jour:');
    updatedStudents.slice(0, 3).forEach((student, index) => {
      const level = student.educationLevel || 'non défini';
      const subjectsCount = student.subjectsOfInterest?.length || 0;
      console.log(`${index + 1}. ${student.firstName} ${student.lastName} - ${level} - ${subjectsCount} matière(s) d'intérêt`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des profils de test:', error);
  } finally {
    console.log('\n🏁 Script terminé');
    process.exit(0);
  }
}

// Exécuter le script
createTestStudentProfiles();
