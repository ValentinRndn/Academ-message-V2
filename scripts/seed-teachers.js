import mongoose from 'mongoose';
import { connectToDatabase } from '../server/config/database.js';
import Teacher from '../server/models/Teacher.js';
import Subject from '../server/models/Subject.js';
import { hashPassword } from '../server/utils/password.js';

const subjects = [
  { name: 'Mathématiques', category: 'sciences', description: 'Algèbre, géométrie, calcul' },
  { name: 'Physique', category: 'sciences', description: 'Mécanique, électricité, optique' },
  { name: 'Chimie', category: 'sciences', description: 'Chimie organique et inorganique' },
  { name: 'Français', category: 'languages', description: 'Grammaire, littérature, expression écrite' },
  { name: 'Anglais', category: 'languages', description: 'Conversation, grammaire, TOEFL/IELTS' },
  { name: 'Histoire', category: 'humanities', description: 'Histoire mondiale et nationale' },
  { name: 'Géographie', category: 'humanities', description: 'Géographie physique et humaine' },
  { name: 'Informatique', category: 'technology', description: 'Programmation, algorithmes' },
  { name: 'Musique', category: 'arts', description: 'Théorie musicale, instruments' },
  { name: 'Arts plastiques', category: 'arts', description: 'Dessin, peinture, sculpture' }
];

const teachers = [
  {
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@example.com',
    password: 'teacher123',
    bio: 'Professeure passionnée avec 10 ans d\'expérience en mathématiques et physique. J\'adapte mon approche à chaque élève pour des résultats optimaux.',
    subjects: ['Mathématiques', 'Physique'],
    hourlyRate: 45,
    languages: ['french', 'english'],
    experience: 10,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '18:00' }
    ]
  },
  {
    firstName: 'Thomas',
    lastName: 'Martin',
    email: 'thomas.martin@example.com',
    password: 'teacher123',
    bio: 'Spécialiste en informatique et mathématiques. J\'enseigne la programmation et les mathématiques appliquées de manière pratique et concrète.',
    subjects: ['Informatique', 'Mathématiques'],
    hourlyRate: 50,
    languages: ['french', 'english', 'spanish'],
    experience: 7,
    availability: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' }
    ]
  },
  {
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@example.com',
    password: 'teacher123',
    bio: 'Professeure d\'anglais et de français. J\'ai vécu 5 ans aux États-Unis et j\'utilise des méthodes interactives pour l\'apprentissage des langues.',
    subjects: ['Anglais', 'Français'],
    hourlyRate: 40,
    languages: ['french', 'english'],
    experience: 5,
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' }
    ]
  },
  {
    firstName: 'Pierre',
    lastName: 'Leroy',
    email: 'pierre.leroy@example.com',
    password: 'teacher123',
    bio: 'Historien de formation, j\'enseigne l\'histoire et la géographie avec passion. J\'utilise des documents historiques et des cartes pour rendre les cours vivants.',
    subjects: ['Histoire', 'Géographie'],
    hourlyRate: 35,
    languages: ['french'],
    experience: 8,
    availability: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }
    ]
  },
  {
    firstName: 'Julie',
    lastName: 'Moreau',
    email: 'julie.moreau@example.com',
    password: 'teacher123',
    bio: 'Artiste et professeure d\'arts plastiques. J\'enseigne différentes techniques artistiques et aide les élèves à développer leur créativité.',
    subjects: ['Arts plastiques', 'Musique'],
    hourlyRate: 42,
    languages: ['french', 'italian'],
    experience: 6,
    availability: [
      { dayOfWeek: 1, startTime: '13:00', endTime: '19:00' },
      { dayOfWeek: 3, startTime: '13:00', endTime: '19:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connexion à la base de données
    await connectToDatabase();
    console.log('Connecté à la base de données');

    // Supprimer les données existantes
    await Subject.deleteMany({});
    await Teacher.deleteMany({});
    console.log('Données existantes supprimées');

    // Créer les matières
    const createdSubjects = await Subject.create(subjects);
    console.log('Matières créées:', createdSubjects.length);

    // Créer un mapping des noms de matières vers leurs IDs
    const subjectMap = {};
    createdSubjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });

    // Préparer les données des professeurs avec les IDs des matières
    const teachersWithSubjectIds = await Promise.all(teachers.map(async teacher => {
      const subjectIds = teacher.subjects.map(subjectName => subjectMap[subjectName]);
      const hashedPassword = await hashPassword(teacher.password);
      
      return {
        ...teacher,
        password: hashedPassword,
        subjects: subjectIds,
        status: 'active',
        averageRating: Math.random() * 2 + 3, // Note entre 3 et 5
        reviewCount: Math.floor(Math.random() * 50) + 10, // Entre 10 et 60 avis
        sessionsCompleted: Math.floor(Math.random() * 100) + 20 // Entre 20 et 120 sessions
      };
    }));

    // Créer les professeurs
    const createdTeachers = await Teacher.create(teachersWithSubjectIds);
    console.log('Professeurs créés:', createdTeachers.length);

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    process.exit();
  }
}

// Exécuter le script
seedDatabase();