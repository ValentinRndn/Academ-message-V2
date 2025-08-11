import { prisma } from '../server/config/database'

async function main() {
  try {
    console.log('Tentative de connexion à MongoDB...')
    
    // Vérifier la connexion en effectuant une requête simple
    const userCount = await prisma.user.count()
    
    console.log('🟢 Connexion réussie à MongoDB!')
    console.log(`Nombre d'utilisateurs dans la base de données: ${userCount}`)
    
    return { success: true, message: 'Connexion réussie à MongoDB' }
  } catch (error) {
    console.error('🔴 Erreur de connexion à MongoDB:', error)
    return { success: false, error }
  } finally {
    // Fermer la connexion Prisma
    await prisma.$disconnect()
  }
}

// Exécuter le script
main()
  .then((result) => {
    if (result.success) {
      console.log('✅ Test de connexion terminé avec succès')
    } else {
      console.error('❌ Test de connexion échoué')
    }
  })
  .catch((e) => {
    console.error('❌ Erreur inattendue pendant le test de connexion:', e)
    process.exit(1)
  })