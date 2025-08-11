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
    
    // Récupérer l'ID de l'enseignant depuis l'URL
    const teacherId = event.context.params?.id
    
    if (!teacherId) {
      return createError({
        statusCode: 400,
        message: 'Teacher ID is required'
      })
    }
    
    // Récupérer les informations de l'enseignant
    const teacher = await prisma.user.findUnique({
      where: {
        id: teacherId,
        role: 'teacher'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: authenticatedUser ? true : false,
        bio: true,
        avatar: true,
        subjectIds: true,
        createdAt: true
      }
    })
    
    if (!teacher) {
      return createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    // Récupérer les sujets de l'enseignant
    const subjects = await prisma.subject.findMany({
      where: {
        id: { in: teacher.subjectIds || [] }
      },
      select: {
        id: true,
        name: true
      }
    })
    
    // Récupérer les disponibilités de l'enseignant
    const availability = await prisma.availability.findMany({
      where: {
        teacherId: teacherId
      }
    })
    
    // Vérifier si l'enseignant est disponible maintenant
    const isAvailableNow = checkTeacherAvailability(availability)
    
    // Récupérer les avis sur l'enseignant
    const reviews = await prisma.review.findMany({
      where: {
        teacherId: teacherId
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        studentId: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Calculer la note moyenne
    let averageRating = null
    if (reviews.length > 0) {
      averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    }
    
    // Compter le nombre de sessions complétées
    const completedBookings = await prisma.booking.count({
      where: {
        teacherId: teacherId,
        status: 'completed'
      }
    })
    
    // Récupérer quelques sessions à venir (si l'utilisateur est authentifié)
    const upcomingBookings = authenticatedUser ? await prisma.booking.findMany({
      where: {
        teacherId: teacherId,
        status: 'confirmed',
        startTime: {
          gte: new Date()
        }
      },
      take: 5,
      orderBy: {
        startTime: 'asc'
      }
    }) : []
    
    // Récupérer l'expérience professionnelle de l'enseignant
    const experience = await prisma.experience.findMany({
      where: {
        teacherId: teacherId
      },
      orderBy: {
        startDate: 'desc'
      }
    })
    
    // Récupérer la formation académique de l'enseignant
    const education = await prisma.education.findMany({
      where: {
        teacherId: teacherId
      },
      orderBy: {
        endDate: 'desc'
      }
    })
    
    return {
      teacher: {
        ...teacher,
        subjects,
        availability,
        isAvailableNow,
        reviews,
        averageRating,
        reviewCount: reviews.length,
        sessionsCompleted: completedBookings,
        experience,
        education,
        upcomingBookings: authenticatedUser ? upcomingBookings : [],
        // Simuler le prix horaire (à implémenter dans le modèle plus tard)
        hourlyRate: Math.floor(Math.random() * 30) + 30
      }
    }
  } catch (error: any) {
    console.error('Error fetching teacher details:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch teacher details'
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