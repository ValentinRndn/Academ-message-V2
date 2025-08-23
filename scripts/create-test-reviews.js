import { connectToDatabase } from '../server/config/database.js';
import User from '../server/models/userModel.js';
import Booking from '../server/models/Booking.js';
import Review from '../server/models/Review.js';
import { ObjectId } from 'mongodb';

async function createTestReviews() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    console.log('✅ Connexion établie');

    // Récupérer un professeur
    const teachers = await User.findUsers({ role: 'teacher' });
    if (teachers.length === 0) {
      console.log('❌ Aucun professeur trouvé');
      return;
    }
    const teacher = teachers[0];
    console.log(`👨‍🏫 Professeur trouvé: ${teacher.firstName} ${teacher.lastName}`);

    // Récupérer des étudiants
    const students = await User.findUsers({ role: 'student' });
    if (students.length === 0) {
      console.log('❌ Aucun étudiant trouvé');
      return;
    }
    console.log(`👥 ${students.length} étudiants trouvés`);

    // Récupérer des réservations du professeur
    const bookings = await Booking.find({ teacherId: new ObjectId(teacher._id) });
    if (bookings.length === 0) {
      console.log('❌ Aucune réservation trouvée pour ce professeur');
      return;
    }
    console.log(`📅 ${bookings.length} réservations trouvées`);

    // Commentaires d'exemple
    const comments = [
      "Excellent professeur, très pédagogue et patient. J'ai beaucoup progressé grâce à ses cours.",
      "Cours très bien structuré et adapté à mon niveau. Je recommande vivement !",
      "Professeur compétent et à l'écoute. Les explications sont claires et précises.",
      "Très satisfait de ce cours. Le professeur sait s'adapter aux difficultés de l'étudiant.",
      "Cours de qualité avec un professeur expérimenté. Je continue avec plaisir.",
      "Approche pédagogique efficace et bienveillante. Parfait pour progresser.",
      "Professeur disponible et professionnel. Les cours sont toujours enrichissants.",
      "Excellente méthodologie d'enseignement. Je vois mes progrès rapidement.",
      "Cours dynamique et intéressant. Le professeur est passionné par sa matière.",
      "Très bon équilibre entre théorie et pratique. Je recommande !"
    ];

    const tags = [
      ['Pédagogie', 'Patient'],
      ['Méthodologie', 'Clair'],
      ['Disponibilité', 'Professionnel'],
      ['Progression', 'Efficace'],
      ['Passion', 'Dynamique']
    ];

    // Créer des avis de test
    const reviewsToCreate = [];
    const usedBookings = new Set();

    for (let i = 0; i < Math.min(8, bookings.length); i++) {
      const booking = bookings[i];
      
      // Éviter les doublons
      if (usedBookings.has(booking._id.toString())) continue;
      usedBookings.add(booking._id.toString());

      const student = students[i % students.length];
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 étoiles
      const comment = comments[i % comments.length];
      const reviewTags = tags[i % tags.length];

      const review = {
        bookingId: new ObjectId(booking._id),
        studentId: new ObjectId(student._id),
        teacherId: new ObjectId(teacher._id),
        rating: rating,
        comment: comment,
        tags: reviewTags,
        status: 'approved',
        isAnonymous: false,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Derniers 30 jours
      };

      reviewsToCreate.push(review);
    }

    // Insérer les avis
    if (reviewsToCreate.length > 0) {
      const result = await Review.insertMany(reviewsToCreate);
      console.log(`✅ ${result.length} avis créés avec succès`);

      // Afficher quelques statistiques
      const totalReviews = await Review.countDocuments({ teacherId: new ObjectId(teacher._id) });
      const avgRating = await Review.aggregate([
        { $match: { teacherId: new ObjectId(teacher._id) } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ]);

      console.log(`📊 Statistiques pour ${teacher.firstName} ${teacher.lastName}:`);
      console.log(`   - Total avis: ${totalReviews}`);
      console.log(`   - Note moyenne: ${avgRating.length > 0 ? avgRating[0].avg.toFixed(1) : 0}/5`);

    } else {
      console.log('⚠️ Aucun avis à créer (toutes les réservations ont déjà des avis)');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des avis:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
createTestReviews();
