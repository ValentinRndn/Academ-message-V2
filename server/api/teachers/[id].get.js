import Teacher from '../../models/Teacher.js';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;

    const teacher = await Teacher.findById(id).populate('subjects');

    if (!teacher) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Professeur non trouvé'
      });
    }

    // Vérifier si le professeur est actif
    if (teacher.status !== 'active') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Ce professeur n\'est plus disponible'
      });
    }

    // Convertir en objet et ajouter la disponibilité actuelle
    const teacherObj = teacher.toObject();
    teacherObj.isAvailableNow = teacher.isAvailableNow();

    return teacherObj;
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur:', error);
    
    if (error.statusCode === 404) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération du professeur'
    });
  }
});
