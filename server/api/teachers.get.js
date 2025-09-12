import Teacher from '../models/Teacher.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { search, subject, page = 1, limit = 20 } = query

    // Construire le filtre de base
    const filter = {
      status: 'active'
    }
    
    // Filtre de recherche par nom ou email
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Filtre par matière
    if (subject) {
      filter.subjects = subject
    }
    
    // Calculer la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)
    
    // Récupérer les professeurs avec population des matières
    const [teachers, totalCount] = await Promise.all([
      Teacher.find(filter)
        .populate('subjects', 'name description')
        .sort({ averageRating: -1, reviewCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Teacher.countDocuments(filter)
    ])
    
    // Ajouter des propriétés calculées
    const teachersWithProps = teachers.map(teacher => {
      // Formater les matières pour compatibilité
      const formattedSubjects = (teacher.subjects || []).map(subject => ({
        id: subject._id.toString(),
        name: subject.name,
        description: subject.description
      }))
      
      return {
        ...teacher,
        _id: teacher._id.toString(),
        subjects: formattedSubjects,
        // Vérifier si disponible maintenant (simplification)
        isAvailableNow: teacher.availability && teacher.availability.length > 0
      }
    })
    
    return {
      success: true,
      teachers: teachersWithProps,
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    }
    
  } catch (error) {
    console.error('Error fetching teachers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des professeurs'
    })
  }
})