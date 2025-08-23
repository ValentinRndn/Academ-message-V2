import Teacher from '../../models/Teacher.js';
import { connectToDatabase } from '../../config/database.js';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  try {
    // S'assurer que la connexion à la base de données est établie
    await connectToDatabase();
    console.log('Tentative de récupération des professeurs...');
    const query = getQuery(event);
    const {
      search,
      subject,
      minRating = 0,
      page = 1,
      limit = 20
    } = query;

    // Construire le filtre de recherche
    const filter = {};

    // Recherche par nom ou matière
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtre par matière
    if (subject) {
      try {
        const subjectId = new mongoose.Types.ObjectId(subject);
        filter.subjects = subjectId;
      } catch (err) {
        console.error('ID de matière invalide:', subject);
      }
    }

    // Filtre par note minimale
    if (minRating > 0) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    // Ajouter le filtre de statut actif
    filter.status = 'active';

    // Calculer le skip pour la pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Récupérer les professeurs avec pagination
    const teachers = await Teacher.find(filter)
      .populate('subjects')
      .skip(skip)
      .limit(Number(limit))
      .sort({ averageRating: -1 });

    // Compter le nombre total de professeurs
    const totalCount = await Teacher.countDocuments(filter);

    // Ajouter la propriété isAvailableNow
    const teachersWithAvailability = teachers.map(teacher => {
      const teacherObj = teacher.toObject();
      teacherObj.isAvailableNow = teacher.isAvailableNow();
      return teacherObj;
    });

    return {
      teachers: teachersWithAvailability,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit))
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des professeurs'
    });
  }
});
