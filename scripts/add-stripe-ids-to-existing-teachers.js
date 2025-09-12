import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import Teacher from '../server/models/Teacher.js';

async function addStripeIdsToExistingTeachers() {
  try {
    console.log('🔄 Ajout des IDs Stripe aux professeurs existants...');
    
    // Connexion MongoDB natif pour les users
    const client = new MongoClient('mongodb://localhost:27017/academ-message-db');
    await client.connect();
    const db = client.db('academ-message-db');
    
    // Connexion Mongoose pour les teachers
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/academ-message-db');
      console.log('✅ Mongoose connecté');
    }
    
    console.log('🔗 Connecté à la base de données');
    
    // Récupérer tous les professeurs
    const teachers = await Teacher.find({}).lean();
    console.log('👨‍🏫 Professeurs trouvés:', teachers.length);
    
    // Vérifier chaque professeur
    for (const teacher of teachers) {
      console.log(`\n🔍 Vérification de ${teacher.firstName} ${teacher.lastName}`);
      console.log(`   Teacher ID: ${teacher._id}`);
      console.log(`   User ID: ${teacher.userId}`);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Stripe Customer: ${teacher.stripeCustomerId || 'MANQUANT'}`);
      console.log(`   Stripe Account: ${teacher.stripeAccountId || 'MANQUANT'}`);
      
      // Récupérer l'utilisateur correspondant
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(teacher.userId) 
      });
      
      if (user) {
        console.log(`   User Stripe Customer: ${user.stripeCustomerId || 'MANQUANT'}`);
        console.log(`   User Stripe Account: ${user.stripeAccountId || 'MANQUANT'}`);
        
        // Si l'utilisateur a des IDs Stripe mais pas le Teacher, les copier
        let needsUpdate = false;
        const updateData = {};
        
        if (user.stripeCustomerId && !teacher.stripeCustomerId) {
          updateData.stripeCustomerId = user.stripeCustomerId;
          needsUpdate = true;
          console.log('   → Copie du Customer ID depuis User');
        }
        
        if (user.stripeAccountId && !teacher.stripeAccountId) {
          updateData.stripeAccountId = user.stripeAccountId;
          needsUpdate = true;
          console.log('   → Copie de l\'Account ID depuis User');
        }
        
        if (needsUpdate) {
          await Teacher.updateOne(
            { _id: teacher._id },
            { $set: updateData }
          );
          console.log('   ✅ Teacher mis à jour avec les IDs Stripe');
        } else if (!user.stripeCustomerId && !user.stripeAccountId) {
          console.log('   ⚠️ Utilisateur sans IDs Stripe (configuration manquante)');
        } else {
          console.log('   ✅ IDs Stripe déjà présents');
        }
      } else {
        console.log('   ❌ Utilisateur non trouvé !');
      }
    }
    
    // Statistiques finales
    const updatedTeachers = await Teacher.find({
      $and: [
        { stripeCustomerId: { $ne: null } },
        { stripeAccountId: { $ne: null } }
      ]
    }).countDocuments();
    
    const totalTeachers = await Teacher.countDocuments();
    
    console.log('\n📊 Statistiques finales:');
    console.log(`  - Total professeurs: ${totalTeachers}`);
    console.log(`  - Avec IDs Stripe complets: ${updatedTeachers}`);
    console.log(`  - Manquant IDs Stripe: ${totalTeachers - updatedTeachers}`);
    
    await client.close();
    await mongoose.connection.close();
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

addStripeIdsToExistingTeachers();