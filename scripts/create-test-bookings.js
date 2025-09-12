import { connectToDatabase } from '../server/config/database.js';
import Booking from '../server/models/Booking.js';
import User from '../server/models/userModel.js';
import Teacher from '../server/models/Teacher.js';
import Subject from '../server/models/Subject.js';
import { ObjectId } from 'mongodb';

async function createTestBookings() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    
    console.log('📚 Récupération des données de test...');
    
    // Récupérer un professeur
    const teacher = await Teacher.findOne();
    if (!teacher) {
      console.error('❌ Aucun professeur trouvé');
      return;
    }
    
    // Récupérer un étudiant
    const students = await User.findUsers({ role: 'student' });
    const student = students[0];
    if (!student) {
      console.error('❌ Aucun étudiant trouvé');
      return;
    }
    
    // Récupérer une matière
    const subject = await Subject.findOne();
    if (!subject) {
      console.error('❌ Aucune matière trouvée');
      return;
    }
    
    console.log(`👨‍🏫 Professeur: ${teacher.firstName} ${teacher.lastName}`);
    console.log(`👨‍🎓 Étudiant: ${student.firstName} ${student.lastName}`);
    console.log(`📖 Matière: ${subject.name}`);
    
    // Supprimer les anciennes réservations de test
    await Booking.deleteMany({ 
      teacherId: teacher._id,
      studentNotes: { $regex: /test/i }
    });
    
    console.log('🗑️ Anciennes réservations de test supprimées');
    
    // Créer des réservations de test pour les prochains jours
    const testBookings = [];
    const now = new Date();
    
    for (let i = 1; i <= 5; i++) {
      const bookingDate = new Date(now);
      bookingDate.setDate(now.getDate() + i);
      bookingDate.setHours(10 + (i * 2), 0, 0, 0); // 10h, 12h, 14h, 16h, 18h
      
      const endDate = new Date(bookingDate);
      endDate.setHours(bookingDate.getHours() + 1);
      
      const duration = 60; // 1 heure
      const hourlyRate = teacher.hourlyRate || 25;
      const teacherAmount = (hourlyRate * duration) / 60;
      const totalAmount = teacherAmount + 5; // +5€ commission
      
      const booking = {
        teacherId: teacher._id,
        studentId: student._id,
        subjectId: subject._id,
        startTime: bookingDate,
        endTime: endDate,
        duration: duration,
        status: i === 1 ? 'confirmed' : (i === 2 ? 'pending' : 'confirmed'),
        paymentStatus: i === 1 ? 'paid' : (i === 2 ? 'pending' : 'paid'),
        totalAmount: totalAmount,
        teacherHourlyRate: hourlyRate,
        platformCommission: 5,
        teacherAmount: teacherAmount,
        currency: 'EUR',
        studentNotes: `Réservation de test ${i} - ${subject.name}`,
        teacherNotes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      testBookings.push(booking);
    }
    
    // Insérer les réservations
    const result = await Booking.insertMany(testBookings);
    
    console.log(`✅ ${result.length} réservations de test créées`);
    
    // Afficher les détails
    result.forEach((booking, index) => {
      const startTime = new Date(booking.startTime);
      console.log(`📅 Réservation ${index + 1}: ${startTime.toLocaleDateString('fr-FR')} à ${startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - Statut: ${booking.status}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des réservations de test:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
createTestBookings();
