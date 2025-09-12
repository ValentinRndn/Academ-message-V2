import { connectToMongoDB } from '../../../utils/mongodb.js';
import { ObjectId } from 'mongodb';

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

    const subjectId = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { name, category = 'other', description = '', icon = '' } = body;

    // Validation des paramètres
    if (!ObjectId.isValid(subjectId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID de matière invalide'
      });
    }

    // Validation des données
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

    // Vérifier que la matière existe
    const existingSubject = await db.collection('subjects').findOne({
      _id: new ObjectId(subjectId)
    });

    if (!existingSubject) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Matière non trouvée'
      });
    }

    // Vérifier que le nom n'est pas déjà utilisé par une autre matière
    const duplicateSubject = await db.collection('subjects').findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: new ObjectId(subjectId) }
    });

    if (duplicateSubject) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Une autre matière avec ce nom existe déjà'
      });
    }

    // Mettre à jour la matière
    const updateData = {
      name: name.trim(),
      category,
      description: description.trim(),
      icon: icon.trim(),
      updatedAt: new Date()
    };

    const result = await db.collection('subjects').updateOne(
      { _id: new ObjectId(subjectId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Matière non trouvée'
      });
    }

    // Récupérer la matière mise à jour avec le nombre de professeurs
    const updatedSubject = await db.collection('subjects').findOne({
      _id: new ObjectId(subjectId)
    });

    const teacherCount = await db.collection('teachers').countDocuments({
      subjects: new ObjectId(subjectId)
    });

    console.log(`Matière mise à jour: ${updatedSubject.name} (ID: ${subjectId})`);

    return {
      success: true,
      subject: {
        ...updatedSubject,
        teacherCount
      },
      message: 'Matière mise à jour avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la matière:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la mise à jour de la matière'
    });
  }
});