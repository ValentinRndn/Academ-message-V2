import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const search = query.search as string
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '100') // Par défaut, on récupère tous les sujets

    // Construire les filtres pour la requête
    const filters: any = {}
    
    // Recherche textuelle
    if (search) {
      filters.name = {
        contains: search,
        mode: 'insensitive'
      }
    }
    
    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit
    
    // Récupérer les sujets
    const subjects = await prisma.subject.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        name: 'asc'
      }
    })
    
    // Récupérer le nombre total de sujets pour la pagination
    const totalCount = await prisma.subject.count({
      where: filters
    })
    
    return {
      subjects,
      totalCount,
      page,
      limit
    }
  } catch (error: any) {
    console.error('Error fetching subjects:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not fetch subjects'
    })
  }
})