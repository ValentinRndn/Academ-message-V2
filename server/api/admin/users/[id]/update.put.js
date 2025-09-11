import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Import dynamique du modèle Teacher
const getTeacherModel = async () => {
  const { default: Teacher } = await import('#/server/models/Teacher.js');
  return Teacher;
};

let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) return db;

  const config = useRuntimeConfig();
  const url = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  
  try {
    if (!client) {
      client = new MongoClient(url);
      await client.connect();
      console.log('Connexion à MongoDB établie');
    }
    
    db = client.db();
    return db;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification et le rôle admin
    if (!event.context.auth?.user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    if (event.context.auth.user.role !== 'admin') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux administrateurs'
      });
    }

    const userId = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID utilisateur requis'
      });
    }

    // Validation de l'ObjectId
    if (!ObjectId.isValid(userId)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID utilisateur invalide'
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      specialization,
      experience,
      bio,
      subjects
    } = body;

    // Validation des données
    if (!firstName || !lastName || !email) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Les champs prénom, nom et email sont obligatoires'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Format d\'email invalide'
      });
    }

    const database = await connectToMongoDB();
    
    // Vérifier que l'utilisateur existe
    const existingUser = await database.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
    
    if (!existingUser) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur introuvable'
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const emailExists = await database.collection('users').findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: new ObjectId(userId) }
    });
    
    if (emailExists) {
      return createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Cet email est déjà utilisé par un autre utilisateur'
      });
    }

    // Préparer les données de mise à jour
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      updatedAt: new Date()
    };

    // Mettre à jour le rôle et statut si fournis
    if (role && ['admin', 'teacher', 'student'].includes(role)) {
      updateData.role = role;
    }

    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      updateData.status = status;
    }

    // Ajouter les champs spécifiques aux professeurs si c'est un professeur
    if (existingUser.role === 'teacher' || role === 'teacher') {
      if (specialization) updateData.specialization = specialization.trim();
      if (experience !== undefined) updateData.experience = parseInt(experience) || 0;
      if (bio !== undefined) updateData.bio = bio?.trim() || '';
      if (subjects) updateData.subjects = subjects || [];
    }

    // Mettre à jour l'utilisateur dans la collection users
    const result = await database.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur introuvable'
      });
    }

    // Si c'est un professeur, mettre à jour aussi l'enregistrement Teacher
    if (existingUser.role === 'teacher' || role === 'teacher') {
      try {
        // S'assurer que Mongoose est connecté
        const config = useRuntimeConfig();
        const mongoUrl = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
        
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(mongoUrl);
          console.log('✅ Mongoose connecté pour mise à jour Teacher');
        }

        const teacherUpdateData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          updatedAt: new Date()
        };

        if (bio !== undefined) teacherUpdateData.bio = bio?.trim() || '';
        if (subjects) teacherUpdateData.subjects = subjects || [];
        if (experience !== undefined) teacherUpdateData.experience = parseInt(experience) || 0;
        if (status) teacherUpdateData.status = status;

        const Teacher = await getTeacherModel();
        await Teacher.findOneAndUpdate(
          { userId: new ObjectId(userId) },
          { $set: teacherUpdateData },
          { upsert: false, new: true }
        );

        console.log('✅ Teacher mis à jour avec succès');
      } catch (teacherError) {
        console.error('❌ Erreur lors de la mise à jour du Teacher:', teacherError);
        // On continue sans faire échouer la mise à jour de l'utilisateur
      }
    }

    // Récupérer l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = await database.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0, tempPassword: 0, resetPasswordToken: 0 } }
    );

    console.log(`✅ Utilisateur mis à jour par l'admin ${event.context.auth.user.email}:`, {
      updatedUserId: userId,
      updatedUserEmail: email,
      changes: updateData,
      updatedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Utilisateur ${firstName} ${lastName} mis à jour avec succès`,
      user: {
        ...updatedUser,
        _id: updatedUser._id.toString()
      }
    };

  } catch (error) {
    console.error('Erreur détaillée lors de la mise à jour de l\'utilisateur:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de la mise à jour de l'utilisateur: ${error.message}`
    });
  }
});