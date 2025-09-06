import { connectToMongoDB } from '../../utils/mongodb.js';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const auth = event.context.auth;
    if (!auth || !auth.user || auth.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé'
      });
    }

    const body = await readBody(event);
    const { name, category = 'other', description = '', icon = '' } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le nom de la matière est requis'
      });
    }

    if (name.trim().length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le nom ne peut pas dépasser 100 caractères'
      });
    }

    if (description.length > 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'La description ne peut pas dépasser 500 caractères'
      });
    }

    const validCategories = ['sciences', 'languages', 'arts', 'humanities', 'technology', 'other'];
    if (!validCategories.includes(category)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Catégorie invalide'
      });
    }

    const db = await connectToMongoDB();

    // Vérifier que le nom n'existe pas déjà
    const existingSubject = await db.collection('subjects').findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingSubject) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Une matière avec ce nom existe déjà'
      });
    }

    // Créer la nouvelle matière
    const newSubject = {
      name: name.trim(),
      category,
      description: description.trim(),
      icon: icon.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('subjects').insertOne(newSubject);

    const createdSubject = {
      _id: result.insertedId,
      ...newSubject,
      teacherCount: 0
    };

    console.log(`Matière créée: ${createdSubject.name} (ID: ${result.insertedId})`);

    return {
      success: true,
      subject: createdSubject,
      message: 'Matière créée avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de la création de la matière:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la création de la matière'
    });
  }
});