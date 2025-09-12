import { MongoClient } from 'mongodb';

async function migrateTeacherCollections() {
  try {
    console.log('🔄 Migration des collections Teacher vers teachers...');
    
    const client = new MongoClient('mongodb://localhost:27017/academ-message-db');
    await client.connect();
    const db = client.db('academ-message-db');
    
    console.log('🔗 Connecté à la base de données:', db.databaseName);
    
    // Vérifier les collections existantes
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📋 Collections existantes:', collectionNames);
    
    const hasTeacher = collectionNames.includes('Teacher');
    const hasTeachers = collectionNames.includes('teachers');
    
    console.log('🔍 Collection Teacher existe:', hasTeacher);
    console.log('🔍 Collection teachers existe:', hasTeachers);
    
    if (hasTeacher) {
      // Compter les documents dans Teacher
      const teacherCount = await db.collection('Teacher').countDocuments();
      console.log('📊 Documents dans Teacher:', teacherCount);
      
      if (teacherCount > 0) {
        // Récupérer tous les documents de Teacher
        const teacherDocs = await db.collection('Teacher').find({}).toArray();
        console.log('📦 Récupération de', teacherDocs.length, 'documents de Teacher');
        
        if (hasTeachers) {
          // Vérifier s'il y a des conflits
          for (const doc of teacherDocs) {
            const existing = await db.collection('teachers').findOne({ 
              $or: [
                { _id: doc._id },
                { email: doc.email },
                { userId: doc.userId }
              ]
            });
            
            if (existing) {
              console.log('⚠️ Conflit détecté pour:', doc.email, 'ID:', doc._id);
              console.log('   Document existant:', existing._id);
              // On peut décider de garder le plus récent ou fusionner
              
              // Garder le plus récent basé sur updatedAt
              if (!existing.updatedAt || (doc.updatedAt && doc.updatedAt > existing.updatedAt)) {
                console.log('   -> Remplacement par le plus récent de Teacher');
                await db.collection('teachers').replaceOne(
                  { _id: existing._id },
                  doc
                );
              } else {
                console.log('   -> Conservation de l\'existant dans teachers');
              }
            } else {
              // Pas de conflit, insérer directement
              await db.collection('teachers').insertOne(doc);
              console.log('✅ Migré:', doc.email);
            }
          }
        } else {
          // Créer la collection teachers et y copier tout
          await db.collection('teachers').insertMany(teacherDocs);
          console.log('✅ Tous les documents Teacher migrés vers teachers');
        }
        
        // Optionnel : Supprimer la collection Teacher après migration
        console.log('🗑️ Suppression de la collection Teacher...');
        await db.collection('Teacher').drop();
        console.log('✅ Collection Teacher supprimée');
      } else {
        console.log('ℹ️ Collection Teacher vide, suppression...');
        await db.collection('Teacher').drop();
      }
    }
    
    // Statistiques finales
    const finalTeachersCount = await db.collection('teachers').countDocuments();
    console.log('📊 Collection teachers finale:', finalTeachersCount, 'documents');
    
    await client.close();
    console.log('✅ Migration terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

migrateTeacherCollections();