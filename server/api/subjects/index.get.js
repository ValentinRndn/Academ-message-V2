import Subject from '../../models/Subject.js';
import { connectToDatabase } from '../../config/database.js';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    console.log('Tentative de récupération des matières...');
    const subjects = await Subject.find().sort('name');
    console.log('Matières récupérées:', subjects.length);
    
    return {
      subjects,
      totalCount: subjects.length
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des matières'
    });
  }
});
