import Subject from '../models/Subject.js';
import { connectToDatabase } from '../config/database.js';

export default defineEventHandler(async (event) => {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Retrieve all active subjects
    const subjects = await Subject.find({})
      .sort({ name: 1 });

    return {
      subjects: subjects,
      total: subjects.length
    };

  } catch (error) {
    console.error('Error retrieving subjects:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Error retrieving subjects'
    });
  }
});