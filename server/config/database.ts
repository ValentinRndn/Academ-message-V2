import { PrismaClient } from '@prisma/client'

// URL de connexion à la base de données MongoDB
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db'

// Configuration de l'instance Prisma
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
    log: ['query', 'error', 'warn'],
  })
}

// Création d'une instance globale de Prisma pour éviter les connexions multiples
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Utiliser l'instance existante ou en créer une nouvelle
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// En développement, réinitialiser la connexion si hot reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma