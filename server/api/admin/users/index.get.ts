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
    const role = query.role as string
    const status = query.status as string
    const search = query.search as string
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '20')
    const skip = (page - 1) * limit
    
    // Construire le filtre
    const filter: any = {}
    
    if (role) {
      filter.role = role
    }
    
    if (status) {
      filter.status = status
    }
    
    if (search) {
      filter.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Récupérer les utilisateurs
    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        verifiedAt: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Récupérer le nombre total d'utilisateurs pour la pagination
    const totalCount = await prisma.user.count({
      where: filter
    })
    
    // Récupérer des statistiques générales
    const stats = {
      totalUsers: await prisma.user.count(),
      activeUsers: await prisma.user.count({ where: { status: 'active' } }),
      pendingTeachers: await prisma.user.count({ where: { role: 'teacher', status: 'pending' } }),
      studentsCount: await prisma.user.count({ where: { role: 'student' } }),
      teachersCount: await prisma.user.count({ where: { role: 'teacher' } })
    }
    
    return {
      users,
      totalCount,
      stats,
      page,
      limit
    }
    
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch users'
    })
  }
})