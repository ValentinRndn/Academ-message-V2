import { prisma } from '../server/config/database'

async function main() {
  try {
    console.log('Initialisation de la base de données MongoDB...')

    // Vérifier si des utilisateurs existent déjà
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      console.log('La base de données contient déjà des utilisateurs, abandon de l\'initialisation.')
      return
    }

    // Créer les collections
    console.log('Création des collections...')
    
    // Création d'un utilisateur administrateur
    console.log('Création de l\'utilisateur administrateur...')
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'Système',
        email: 'admin@example.com',
        password: 'adminpass123', // À hacher en production
        role: 'admin',
        bio: 'Administrateur système',
        createdAt: new Date(),
        updatedAt: new Date(),
        subjectIds: []
      }
    })

    // Création d'un enseignant de démonstration
    console.log('Création de l\'enseignant de démonstration...')
    await prisma.user.create({
      data: {
        firstName: 'Prof',
        lastName: 'Démo',
        email: 'teacher@example.com',
        password: 'password123', // À hacher en production
        role: 'teacher',
        bio: 'Enseignant de mathématiques et physique avec 10 ans d\'expérience',
        createdAt: new Date(),
        updatedAt: new Date(),
        subjectIds: [] // À remplir avec les IDs des matières
      }
    })

    // Création d'un étudiant de démonstration
    console.log('Création de l\'étudiant de démonstration...')
    await prisma.user.create({
      data: {
        firstName: 'Étudiant',
        lastName: 'Test',
        email: 'student@example.com',
        password: 'password123', // À hacher en production
        role: 'student',
        bio: 'Étudiant en licence de mathématiques',
        createdAt: new Date(),
        updatedAt: new Date(),
        subjectIds: []
      }
    })

    console.log('✅ Base de données initialisée avec succès!')
  } catch (error) {
    console.error('🔴 Erreur lors de l\'initialisation de la base de données:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
main()
  .catch((e) => {
    console.error('❌ Erreur inattendue pendant l\'initialisation:', e)
    process.exit(1)
  })