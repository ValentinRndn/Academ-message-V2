import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const defaultSubjects = [
  {
    name: 'Mathématiques',
    category: 'sciences',
    description: 'Algèbre, géométrie, analyse et statistiques',
    icon: '🔢',
    createdAt: new Date()
  },
  {
    name: 'Physique',
    category: 'sciences',
    description: 'Mécanique, thermodynamique, électricité et optique',
    icon: '⚡',
    createdAt: new Date()
  },
  {
    name: 'Chimie',
    category: 'sciences',
    description: 'Chimie organique, inorganique et physique',
    icon: '🧪',
    createdAt: new Date()
  },
  {
    name: 'Français',
    category: 'languages',
    description: 'Grammaire, littérature et expression écrite',
    icon: '📚',
    createdAt: new Date()
  },
  {
    name: 'Anglais',
    category: 'languages',
    description: 'Grammaire anglaise, vocabulaire et conversation',
    icon: '🇬🇧',
    createdAt: new Date()
  },
  {
    name: 'Histoire',
    category: 'humanities',
    description: 'Histoire de France et mondiale',
    icon: '📜',
    createdAt: new Date()
  },
  {
    name: 'Géographie',
    category: 'humanities',
    description: 'Géographie physique et humaine',
    icon: '🗺️',
    createdAt: new Date()
  },
  {
    name: 'Informatique',
    category: 'technology',
    description: 'Programmation, algorithmes et systèmes',
    icon: '💻',
    createdAt: new Date()
  },
  {
    name: 'Arts plastiques',
    category: 'arts',
    description: 'Dessin, peinture et sculpture',
    icon: '🎨',
    createdAt: new Date()
  },
  {
    name: 'Musique',
    category: 'arts',
    description: 'Théorie musicale et pratique instrumentale',
    icon: '🎵',
    createdAt: new Date()
  }
]

async function initSubjects() {
  let client

  try {
    client = new MongoClient(process.env.DATABASE_URL)
    await client.connect()
    
    const db = client.db()
    const subjectsCollection = db.collection('subjects')
    
    // Vérifier si des matières existent déjà
    const existingCount = await subjectsCollection.countDocuments()
    
    if (existingCount > 0) {
      console.log(`${existingCount} matières trouvées dans la base de données.`)
      
      // Afficher les matières existantes
      const existing = await subjectsCollection.find({}).toArray()
      console.log('\nMatières existantes:')
      existing.forEach((subject, index) => {
        console.log(`${index + 1}. ${subject.name} (${subject.category}) ${subject.icon || ''}`)
      })
      
      return
    }
    
    console.log('Aucune matière trouvée. Initialisation des matières par défaut...')
    
    // Insérer les matières par défaut
    const result = await subjectsCollection.insertMany(defaultSubjects)
    
    console.log(`✅ ${result.insertedCount} matières ajoutées avec succès!`)
    
    // Afficher les matières créées
    console.log('\nMatières créées:')
    defaultSubjects.forEach((subject, index) => {
      console.log(`${index + 1}. ${subject.name} (${subject.category}) ${subject.icon}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des matières:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

initSubjects()