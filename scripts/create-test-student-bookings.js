import { connectToDatabase } from '../server/config/database.js';
import Booking from '../server/models/Booking.js';
import { findUsers } from '../server/models/userModel.js';
import Subject from '../server/models/Subject.js';

async function createTestStudentBookings() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    console.log('✅ Connexion établie');

    // Récupérer les étudiants et enseignants
    console.log('👥 Récupération des utilisateurs...');
    const students = await findUsers({ role: 'student' });
    const teachers = await findUsers({ role: 'teacher' });
    const subjects = await Subject.find();
    
    console.log(`📊 ${students.length} étudiants trouvés`);
    console.log(`👨‍🏫 ${teachers.length} enseignants trouvés`);
    console.log(`📚 ${subjects.length} matières trouvées`);

    if (students.length === 0 || teachers.length === 0) {
      console.log('❌ Aucun étudiant ou enseignant trouvé. Créez d\'abord des utilisateurs.');
      return;
    }

    // Nettoyer les anciennes réservations de test
    console.log('🧹 Nettoyage des anciennes réservations de test...');
    await Booking.deleteMany({ notes: { $regex: /Test booking/i } });
    console.log('✅ Anciennes réservations supprimées');

    let createdCount = 0;
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    // Créer des réservations pour chaque étudiant
    for (const student of students) {
      // Créer 3-8 réservations par étudiant
      const numBookings = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numBookings; i++) {
        try {
          // Sélectionner un enseignant aléatoire
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];
          const subject = subjects[Math.floor(Math.random() * subjects.length)];
          
          // Récupérer le profil Teacher correspondant
          const Teacher = await import('../server/models/Teacher.js').then(m => m.default);
          const teacherProfile = await Teacher.findOne({ userId: teacher._id });
          
          if (!teacherProfile) {
            console.log(`⚠️ Aucun profil Teacher trouvé pour ${teacher.firstName} ${teacher.lastName}`);
            continue;
          }
          
          // Générer une date aléatoire (passée ou future)
          const now = new Date();
          const isPast = Math.random() > 0.4; // 60% de cours passés
          
          let startTime;
          if (isPast) {
            // Cours passé (1-30 jours dans le passé)
            const daysAgo = Math.floor(Math.random() * 30) + 1;
            startTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
          } else {
            // Cours futur (1-14 jours dans le futur)
            const daysAhead = Math.floor(Math.random() * 14) + 1;
            startTime = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
          }

          // Heure aléatoire entre 9h et 20h
          const hour = Math.floor(Math.random() * 11) + 9; // 9-19h
          const minute = Math.random() > 0.5 ? 0 : 30; // 0 ou 30 minutes
          startTime.setHours(hour, minute, 0, 0);

          // Durée aléatoire (1-2 heures)
          const duration = Math.random() > 0.5 ? 1 : 2;
          const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

          // Statut basé sur la date
          let status;
          if (isPast) {
            status = Math.random() > 0.1 ? 'completed' : 'cancelled'; // 90% terminés, 10% annulés
          } else {
            status = Math.random() > 0.3 ? 'confirmed' : 'pending'; // 70% confirmés, 30% en attente
          }

          // Tarif horaire aléatoire
          const hourlyRate = Math.floor(Math.random() * 30) + 25; // 25-55€/h

          // Notes aléatoires
          const notes = [
            'Cours de soutien en mathématiques',
            'Révision pour l\'examen',
            'Exercices pratiques',
            'Explication de concepts difficiles',
            'Préparation au contrôle',
            'Cours de méthodologie',
            'Aide aux devoirs',
            'Remise à niveau'
          ];
          const randomNote = notes[Math.floor(Math.random() * notes.length)];

          // Calculer les montants
          const durationInHours = duration;
          const teacherAmount = Math.round(durationInHours * hourlyRate * 100) / 100;
          const platformCommission = 5;
          const totalAmount = Math.round((teacherAmount + platformCommission) * 100) / 100;

          // Créer la réservation
          const booking = new Booking({
            studentId: student._id,
            teacherId: teacherProfile._id,
            subjectId: subject._id,
            startTime,
            endTime,
            duration: duration * 60, // Convertir en minutes
            teacherHourlyRate: hourlyRate,
            teacherAmount,
            totalAmount,
            platformCommission,
            status,
            studentNotes: `${randomNote} - Test booking`,
            createdAt: new Date(startTime.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Créé 1-7 jours avant
            updatedAt: new Date()
          });

          await booking.save();
          createdCount++;
          
          console.log(`✅ Réservation créée: ${student.firstName} → ${teacher.firstName} (${subject.name}) - ${status}`);
        } catch (error) {
          console.error(`❌ Erreur lors de la création de la réservation pour ${student.firstName}:`, error.message);
        }
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`✅ ${createdCount} réservations créées`);

    // Afficher quelques statistiques
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    console.log(`\n📈 Statistiques globales:`);
    console.log(`📋 Total des réservations: ${totalBookings}`);
    console.log(`✅ Cours terminés: ${completedBookings}`);
    console.log(`⏳ En attente: ${pendingBookings}`);
    console.log(`✅ Confirmés: ${confirmedBookings}`);
    console.log(`❌ Annulés: ${cancelledBookings}`);

    // Afficher quelques exemples de réservations créées
    const sampleBookings = await Booking.find()
      .populate('studentId', 'firstName lastName')
      .populate('teacherId', 'firstName lastName')
      .populate('subjectId', 'name')
      .limit(5);

    console.log('\n👥 Exemples de réservations:');
    sampleBookings.forEach((booking, index) => {
      const date = new Date(booking.startTime).toLocaleDateString('fr-FR');
      console.log(`${index + 1}. ${booking.studentId.firstName} ${booking.studentId.lastName} → ${booking.teacherId.firstName} ${booking.teacherId.lastName} (${booking.subjectId.name}) - ${date} - ${booking.status}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des réservations de test:', error);
  } finally {
    console.log('\n🏁 Script terminé');
    process.exit(0);
  }
}

// Exécuter le script
createTestStudentBookings();
