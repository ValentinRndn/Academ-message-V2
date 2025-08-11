import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    const token = extractTokenFromHeader(authHeader)
    
    // Pour cette API, on permet l'accès même sans authentification
    // mais on limite certaines informations si l'utilisateur n'est pas authentifié
    let authenticatedUser = null
    if (token) {
      try {
        authenticatedUser = verifyToken(token)
      } catch (error) {
        // On ignore l'erreur si le token est invalide
      }
    }
    
    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const subject = query.subject as string
    const searchQuery = query.query as string
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '20')
    const skip = (page - 1) * limit
    
    // Construire les filtres pour la requête
    const filters: any = {
      role: 'teacher'
    }
    
    // Recherche par sujet
    if (subject) {
      filters.subjectIds = {
        has: subject
      }
    }
    
    // Recherche textuelle
    if (searchQuery) {
      filters.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { bio: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }
    
    // Récupérer les enseignants avec les filtres
    const teachers = await prisma.user.findMany({
      where: filters,
      skip,
      take: limit
    })
    
    // Récupérer le nombre total d'enseignants pour la pagination
    const totalCount = await prisma.user.count({
      where: filters
    })

    // Préparer les données des enseignants avec les informations supplémentaires
    const teachersWithSubjects = await Promise.all(
      teachers.map(async (teacher) => {
        // Récupérer les subjects associés à l'enseignant
        const subjects = await prisma.subject.findMany({
          where: {
            id: { in: teacher.subjectIds }
          },
          select: {
            id: true,
            name: true
          }
        })
        
        // Récupérer les disponibilités de l'enseignant
        const availability = await prisma.availability.findMany({
          where: {
            teacherId: teacher.id
          }
        })
        
        // Calculer si l'enseignant est disponible maintenant
        const isAvailableNow = checkTeacherAvailability(availability)
        
        // Récupérer les avis pour calculer la note moyenne
        const reviews = await prisma.review.findMany({
          where: {
            teacherId: teacher.id
          },
          select: {
            rating: true
          }
        })
        
        let averageRating = null
        if (reviews.length > 0) {
          averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        }
        
        // Compter le nombre de sessions complétées
        const completedBookings = await prisma.booking.count({
          where: {
            teacherId: teacher.id,
            status: 'completed'
          }
        })
        
        // Retourner l'enseignant avec les informations supplémentaires
        return {
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: authenticatedUser ? teacher.email : undefined,
          bio: teacher.bio || '',
          avatar: teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
          subjects,
          availability,
          isAvailableNow,
          averageRating,
          reviewCount: reviews.length,
          sessionsCompleted: completedBookings,
          hourlyRate: Math.floor(Math.random() * 30) + 30, // Simuler le prix horaire
          languages: ['french', 'english'], // Simuler les langues
          experience: Math.floor(Math.random() * 10) + 1 // Simuler l'expérience
        }
      })
    )
    
    return {
      teachers: teachersWithSubjects,
      totalCount,
      page,
      limit
    }
  } catch (error: any) {
    console.error('Error fetching teachers:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch teachers'
    })
  }
})

// Vérifier si l'enseignant est disponible maintenant
function checkTeacherAvailability(availability: any[]): boolean {
  if (!availability || availability.length === 0) return false
  
  const now = new Date()
  const currentDay = now.getDay() // 0-6, 0 étant dimanche
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  return availability.some(slot => {
    if (slot.recurring && slot.dayOfWeek === currentDay) {
      // Convertir les heures de début et de fin en minutes depuis minuit
      const startTime = new Date(slot.startTime)
      const endTime = new Date(slot.endTime)
      
      const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
      const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()
      const currentMinutes = currentHour * 60 + currentMinute
      
      return currentMinutes >= startMinutes && currentMinutes < endMinutes
    } else if (!slot.recurring && slot.date) {
      // Pour les disponibilités non récurrentes
      const slotDate = new Date(slot.date)
      if (slotDate.toDateString() === now.toDateString()) {
        const startTime = new Date(slot.startTime)
        const endTime = new Date(slot.endTime)
        
        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()
        const currentMinutes = currentHour * 60 + currentMinute
        
        return currentMinutes >= startMinutes && currentMinutes < endMinutes
      }
    }
    
    return false
  })
}