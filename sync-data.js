import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

async function syncData() {
  try {
    console.log('🔄 Synchronisation des données...');
    
    const client = new MongoClient('mongodb://localhost:27017/academ-message-db');
    await client.connect();
    const db = client.db('academ-message-db');
    
    console.log('🔗 Connecté à la base de données:', db.databaseName);
    
    // 1. Récupérer tous les teachers de la collection teachers
    const teachers = await db.collection('teachers').find({}).toArray();
    console.log('👨‍🏫 Teachers trouvés:', teachers.length);
    
    // 2. Pour chaque teacher, créer ou mettre à jour l'utilisateur correspondant
    for (const teacher of teachers) {
      console.log(`\n🔍 Traitement de ${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
      
      // Vérifier si l'utilisateur existe déjà
      let user = null;
      if (teacher.userId) {
        user = await db.collection('users').findOne({ _id: new ObjectId(teacher.userId) });
        console.log('  - Utilisateur existant trouvé via userId:', user ? 'OUI' : 'NON');
      }
      
      if (!user) {
        // Chercher par email
        user = await db.collection('users').findOne({ email: teacher.email });
        console.log('  - Utilisateur trouvé par email:', user ? 'OUI' : 'NON');
      }
      
      if (!user) {
        // Créer un nouvel utilisateur
        console.log('  - Création d\'un nouvel utilisateur...');
        const password = await bcrypt.hash('password123', 10);
        const newUser = {
          _id: new ObjectId(),
          email: teacher.email,
          password: password,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          role: 'teacher',
          bio: teacher.bio || '',
          avatar: teacher.avatar || '',
          status: teacher.status || 'active',
          subjectIds: teacher.subjects || [],
          createdAt: teacher.createdAt || new Date(),
          updatedAt: new Date()
        };
        
        await db.collection('users').insertOne(newUser);
        console.log('  - ✅ Nouvel utilisateur créé avec l\'ID:', newUser._id);
        
        // Mettre à jour le teacher avec le bon userId
        await db.collection('teachers').updateOne(
          { _id: teacher._id },
          { $set: { userId: newUser._id } }
        );
        console.log('  - ✅ Teacher mis à jour avec le bon userId');
        
      } else {
        console.log('  - ✅ Utilisateur existe déjà avec l\'ID:', user._id);
        
        // Vérifier que le teacher a le bon userId
        if (!teacher.userId || teacher.userId.toString() !== user._id.toString()) {
          await db.collection('teachers').updateOne(
            { _id: teacher._id },
            { $set: { userId: user._id } }
          );
          console.log('  - ✅ Teacher mis à jour avec le bon userId');
        }
      }
    }
    
    // 3. Vérifier que John et Robert existent toujours
    const john = await db.collection('users').findOne({ email: 'john@example.com' });
    const robert = await db.collection('users').findOne({ email: 'robert@example.com' });
    
    console.log('\n👥 Vérification des utilisateurs de test:');
    console.log('  - John:', john ? 'EXISTE' : 'MANQUANT');
    console.log('  - Robert:', robert ? 'EXISTE' : 'MANQUANT');
    
    // 4. Statistiques finales
    const userCount = await db.collection('users').countDocuments();
    const teacherCount = await db.collection('teachers').countDocuments();
    const teacherModelCount = await db.collection('Teacher').countDocuments();
    
    console.log('\n📊 Statistiques finales:');
    console.log('  - Collection User:', userCount, 'utilisateurs');
    console.log('  - Collection teachers:', teacherCount, 'teachers');
    console.log('  - Collection Teacher:', teacherModelCount, 'teachers');
    
    await client.close();
    console.log('\n✅ Synchronisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  }
}

syncData();
