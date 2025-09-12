import { MongoClient } from 'mongodb';

async function checkCollections() {
  try {
    console.log('🔍 Vérification des collections...');
    
    const client = new MongoClient('mongodb://localhost:27017/academ-message-db');
    await client.connect();
    const db = client.db('academ-message-db');
    
    // Lister toutes les collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections disponibles:', collections.map(c => c.name));
    
    // Vérifier le contenu des collections importantes
    const userCount = await db.collection('users').countDocuments();
    const teacherCount = await db.collection('teachers').countDocuments();
    
    console.log('\n📊 Compteurs:');
    console.log('  - users:', userCount);
    console.log('  - teachers:', teacherCount);
    
    if (userCount > 0) {
      console.log('\n👥 Échantillon d\'utilisateurs:');
      const users = await db.collection('users').find({}).limit(3).toArray();
      users.forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - Rôle: ${user.role}`);
        console.log(`    Stripe Customer: ${user.stripeCustomerId || 'MANQUANT'}`);
        console.log(`    Stripe Account: ${user.stripeAccountId || 'MANQUANT'}`);
      });
    }
    
    if (teacherCount > 0) {
      console.log('\n👨‍🏫 Échantillon de professeurs:');
      const teachers = await db.collection('teachers').find({}).limit(3).toArray();
      teachers.forEach(teacher => {
        console.log(`  - ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
        console.log(`    User ID: ${teacher.userId}`);
        console.log(`    Stripe Customer: ${teacher.stripeCustomerId || 'MANQUANT'}`);
        console.log(`    Stripe Account: ${teacher.stripeAccountId || 'MANQUANT'}`);
      });
    }
    
    await client.close();
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

checkCollections();