import webpush from 'web-push'
import fs from 'fs'
import path from 'path'

console.log('🔑 Génération des clés VAPID pour les notifications push...')

try {
  // Générer les clés VAPID
  const vapidKeys = webpush.generateVAPIDKeys()
  
  console.log('✅ Clés VAPID générées avec succès !')
  console.log('\n📋 Clés à ajouter dans votre fichier .env :')
  console.log('==========================================')
  console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`)
  console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`)
  console.log('==========================================')
  
  // Créer un fichier temporaire avec les clés
  const keysContent = `# Clés VAPID générées le ${new Date().toISOString()}
# Ajoutez ces lignes à votre fichier .env
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`
  
  const keysPath = path.join(process.cwd(), 'vapid-keys.txt')
  fs.writeFileSync(keysPath, keysContent)
  
  console.log(`\n💾 Les clés ont été sauvegardées dans : ${keysPath}`)
  console.log('⚠️  N\'oubliez pas d\'ajouter ces clés à votre fichier .env !')
  console.log('⚠️  Ne partagez jamais la clé privée !')
  
} catch (error) {
  console.error('❌ Erreur lors de la génération des clés VAPID:', error)
  process.exit(1)
}
