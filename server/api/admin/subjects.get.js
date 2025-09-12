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

    const db = await connectToMongoDB();
    
    // Récupérer toutes les matières
    const subjects = await db.collection('subjects').find({})
      .sort({ name: 1 })
      .toArray();

    // Compter le nombre de professeurs pour chaque matière
    const subjectsWithTeacherCount = await Promise.all(
      subjects.map(async (subject) => {
        const teacherCount = await db.collection('teachers').countDocuments({
          subjects: subject._id
        });
        
        return {
          ...subject,
          teacherCount
        };
      })
    );

    return {
      subjects: subjectsWithTeacherCount,
      total: subjects.length
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des matières'
    });
  }
});