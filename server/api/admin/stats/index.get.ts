import { PrismaClient } from '@prisma/client'
import { extractTokenFromHeader, verifyToken } from '../../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const authHeader = getHeader(event, 'authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    
    const user = verifyToken(token)
    
    // Vérifier que l'utilisateur est un administrateur
    if (user.role !== 'admin') {
      return createError({
        statusCode: 403,
        message: 'Forbidden: Admin access required'
      })
    }
    
    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const period = query.period as string || 'month' // 'day', 'week', 'month', 'year'
    
    // Calculer la date de début en fonction de la période
    const startDate = new Date()
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setMonth(startDate.getMonth() - 1) // Par défaut, 1 mois
    }
    
    // Statistiques des utilisateurs
    const userStats = {
      total: await prisma.user.count(),
      newUsers: await prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      activeUsers: await prisma.user.count({
        where: {
          status: 'active'
        }
      }),
      students: await prisma.user.count({
        where: {
          role: 'student'
        }
      }),
      teachers: await prisma.user.count({
        where: {
          role: 'teacher'
        }
      }),
      pendingTeachers: await prisma.user.count({
        where: {
          role: 'teacher',
          status: 'pending'
        }
      })
    }
    
    // Statistiques des réservations
    const bookingStats = {
      total: await prisma.booking.count(),
      newBookings: await prisma.booking.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      pendingBookings: await prisma.booking.count({
        where: {
          status: 'pending'
        }
      }),
      confirmedBookings: await prisma.booking.count({
        where: {
          status: 'confirmed'
        }
      }),
      completedBookings: await prisma.booking.count({
        where: {
          status: 'completed'
        }
      }),
      cancelledBookings: await prisma.booking.count({
        where: {
          status: 'cancelled'
        }
      })
    }
    
    // Statistiques des paiements
    const paymentStats = {
      totalAmount: await prisma.booking.aggregate({
        _sum: {
          amount: true
        },
        where: {
          paymentStatus: 'paid'
        }
      }),
      periodAmount: await prisma.booking.aggregate({
        _sum: {
          amount: true
        },
        where: {
          paymentStatus: 'paid',
          paymentDate: { gte: startDate }
        }
      }),
      pendingPayments: await prisma.booking.count({
        where: {
          paymentStatus: 'pending'
        }
      }),
      failedPayments: await prisma.booking.count({
        where: {
          paymentStatus: 'failed'
        }
      })
    }
    
    // Statistiques des messages
    const messageStats = {
      total: await prisma.message.count(),
      newMessages: await prisma.message.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      unreadMessages: await prisma.message.count({
        where: {
          read: false
        }
      })
    }
    
    // Obtenir les données pour les graphiques
    const now = new Date()
    const userRegistrationsByDay = await getDailyRegistrations(startDate, now)
    const bookingsByDay = await getDailyBookings(startDate, now)
    
    return {
      userStats,
      bookingStats,
      paymentStats,
      messageStats,
      charts: {
        userRegistrationsByDay,
        bookingsByDay
      }
    }
    
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch admin statistics'
    })
  }
})

// Fonction pour obtenir les inscriptions quotidiennes
async function getDailyRegistrations(startDate: Date, endDate: Date) {
  // Créer un tableau de dates entre startDate et endDate
  const dates = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Récupérer les données d'inscription pour chaque jour
  const result = []
  for (const date of dates) {
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)
    
    const count = await prisma.user.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDay
        }
      }
    })
    
    result.push({
      date: date.toISOString().split('T')[0],
      count
    })
  }
  
  return result
}

// Fonction pour obtenir les réservations quotidiennes
async function getDailyBookings(startDate: Date, endDate: Date) {
  // Créer un tableau de dates entre startDate et endDate
  const dates = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Récupérer les données de réservation pour chaque jour
  const result = []
  for (const date of dates) {
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)
    
    const count = await prisma.booking.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDay
        }
      }
    })
    
    result.push({
      date: date.toISOString().split('T')[0],
      count
    })
  }
  
  return result
}