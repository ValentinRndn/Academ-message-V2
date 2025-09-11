import Teacher from '../../models/Teacher.js';
import { connectToDatabase } from '../../config/database.js';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est authentifié et est un professeur
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Vérifier que l'utilisateur est un professeur
    if (auth.user.role !== 'teacher') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Access restricted to teachers'
      });
    }

    // Récupérer les données du body
    const body = await readBody(event);
    
    // Chercher le profil Teacher correspondant à cet utilisateur
    const teacherProfile = await Teacher.findOne({ userId: auth.user._id });

    if (!teacherProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Teacher profile not found'
      });
    }

    // Champs modifiables par le professeur
    const allowedFields = [
      'bio',
      'avatar',
      'subjects',
      'availability',
      'hourlyRate',
      'languages',
      'experience'
    ];

    // Mettre à jour uniquement les champs autorisés
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'subjects' && Array.isArray(body[field])) {
          // Validation spéciale pour les subjects - s'assurer que ce sont des ObjectIds valides
          console.log('📚 Validation des matières reçues:', body[field]);
          
          const validSubjects = body[field].filter(subjectId => {
            if (typeof subjectId === 'string' && subjectId.match(/^[0-9a-fA-F]{24}$/)) {
              return true;
            }
            console.warn('⚠️ ID matière invalide ignoré:', subjectId);
            return false;
          });
          
          console.log('✅ Matières valides à sauvegarder:', validSubjects);
          teacherProfile[field] = validSubjects;
        } else {
          teacherProfile[field] = body[field];
        }
      }
    });

    // Sauvegarder les modifications
    await teacherProfile.save();

    // Retourner le profil mis à jour avec les subjects peuplés
    const updatedProfile = await Teacher.findById(teacherProfile._id)
      .populate('subjects');

    return {
      teacher: updatedProfile.toObject(),
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Error updating teacher profile'
    });
  }
});
