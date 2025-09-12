// Script pour créer des matières de test
import { MongoClient } from 'mongodb';

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';

const testSubjects = [
  {
    name: 'Mathématiques',
    description: 'Algèbre, géométrie, calcul différentiel et intégral',
    category: 'Sciences',
    level: 'Tous niveaux',
    color: '#3B82F6'
  },
  {
    name: 'Physique',
    description: 'Mécanique, électricité, optique, thermodynamique',
    category: 'Sciences',
    level: 'Tous niveaux',
    color: '#10B981'
  },
  {
    name: 'Chimie',
    description: 'Chimie générale, organique, analytique',
    category: 'Sciences',
    level: 'Tous niveaux',
    color: '#F59E0B'
  },
  {
    name: 'Anglais',
    description: 'Grammaire, vocabulaire, conversation, préparation aux examens',
    category: 'Langues',
    level: 'Tous niveaux',
    color: '#EF4444'
  },
  {
    name: 'Français',
    description: 'Grammaire, littérature, expression écrite et orale',
    category: 'Langues',
    level: 'Tous niveaux',
    color: '#8B5CF6'
  },
  {
    name: 'Espagnol',
    description: 'Grammaire, vocabulaire, conversation, culture hispanique',
    category: 'Langues',
    level: 'Tous niveaux',
    color: '#F97316'
  },
  {
    name: 'Histoire',
    description: 'Histoire de France, histoire mondiale, géopolitique',
    category: 'Humanités',
    level: 'Tous niveaux',
    color: '#06B6D4'
  },
  {
    name: 'Géographie',
    description: 'Géographie physique, humaine, économique',
    category: 'Humanités',
    level: 'Tous niveaux',
    color: '#84CC16'
  },
  {
    name: 'Philosophie',
    description: 'Logique, éthique, métaphysique, histoire de la philosophie',
    category: 'Humanités',
    level: 'Lycée et supérieur',
    color: '#EC4899'
  },
  {
    name: 'Informatique',
    description: 'Programmation, algorithmes, bases de données, web',
    category: 'Technologies',
    level: 'Tous niveaux',
    color: '#6366F1'
  },
  {
    name: 'Économie',
    description: 'Microéconomie, macroéconomie, économie internationale',
    category: 'Sciences sociales',
    level: 'Lycée et supérieur',
    color: '#14B8A6'
  },
  {
    name: 'SVT',
    description: 'Biologie, géologie, écologie',
    category: 'Sciences',
    level: 'Tous niveaux',
    color: '#22C55E'
  }
];

async function createTestSubjects() {
  let client;
  
  try {
    console.log('Connexion à MongoDB...');
    client = new MongoClient(url);
    await client.connect();
    
    const db = client.db();
    const subjectsCollection = db.collection('Subject');
    
    // Vérifier s'il y a déjà des matières
    const existingCount = await subjectsCollection.countDocuments();
    console.log(`Nombre de matières existantes: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('Des matières existent déjà. Voulez-vous les remplacer ? (y/n)');
      // Pour l'automatisation, on continue
    }
    
    // Supprimer les matières existantes si elles existent
    if (existingCount > 0) {
      await subjectsCollection.deleteMany({});
      console.log('Anciennes matières supprimées');
    }
    
    // Ajouter les nouvelles matières
    const result = await subjectsCollection.insertMany(testSubjects);
    console.log(`${result.insertedCount} matières créées avec succès !`);
    
    // Afficher les matières créées
    const createdSubjects = await subjectsCollection.find({}).toArray();
    console.log('\nMatières créées:');
    createdSubjects.forEach(subject => {
      console.log(`- ${subject.name}: ${subject.description}`);
    });
    
  } catch (error) {
    console.error('Erreur lors de la création des matières:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Connexion fermée');
    }
  }
}

// Exécuter le script
createTestSubjects();
