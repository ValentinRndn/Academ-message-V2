import { connectToDatabase } from '../server/config/database.js';
import Teacher from '../server/models/Teacher.js';

// Disponibilités par défaut (lundi à vendredi, 9h-17h)
const defaultAvailability = [
  // Lundi
  { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
  
  // Mardi
  { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 2, startTime: '14:00', endTime: '17:00' },
  
  // Mercredi
  { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 3, startTime: '14:00', endTime: '17:00' },
  
  // Jeudi
  { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 4, startTime: '14:00', endTime: '17:00' },
  
  // Vendredi
  { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 5, startTime: '14:00', endTime: '17:00' }
];

async function addDefaultAvailability() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await connectToDatabase();
    
    console.log('📚 Recherche des professeurs sans disponibilités...');
    
    // Trouver tous les professeurs qui n'ont pas de disponibilités
    const teachersWithoutAvailability = await Teacher.find({
      $or: [
        { availability: { $exists: false } },
        { availability: { $size: 0 } }
      ]
    });
    
    console.log(`📊 ${teachersWithoutAvailability.length} professeurs trouvés sans disponibilités`);
    
    if (teachersWithoutAvailability.length === 0) {
      console.log('✅ Tous les professeurs ont déjà des disponibilités');
      return;
    }
    
    // Ajouter les disponibilités par défaut à chaque professeur
    for (const teacher of teachersWithoutAvailability) {
      console.log(`👨‍🏫 Ajout des disponibilités pour ${teacher.firstName} ${teacher.lastName}...`);
      
      await Teacher.findByIdAndUpdate(teacher._id, {
        $set: {
          availability: defaultAvailability,
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Disponibilités ajoutées pour ${teacher.firstName} ${teacher.lastName}`);
    }
    
    console.log('🎉 Toutes les disponibilités par défaut ont été ajoutées !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des disponibilités:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
addDefaultAvailability();
