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
    
    // Récupérer les données du corps de la requête
    const body = await readBody(event)
    const { action, teacherId, data } = body
    
    if (!action || !teacherId) {
      return createError({
        statusCode: 400,
        message: 'action and teacherId are required'
      })
    }
    
    // Vérifier que l'enseignant existe
    const teacherExists = await prisma.user.findUnique({
      where: {
        id: teacherId,
        role: 'teacher'
      }
    })
    
    if (!teacherExists) {
      return createError({
        statusCode: 404,
        message: 'Teacher not found'
      })
    }
    
    let result
    
    // Effectuer l'action demandée
    switch (action) {
      case 'approve':
        // Approuver un enseignant
        result = await prisma.user.update({
          where: {
            id: teacherId
          },
          data: {
            status: 'active',
            verifiedAt: new Date()
          }
        })
        
        // Envoyer une notification à l'enseignant
        await prisma.notification.create({
          data: {
            userId: teacherId,
            type: 'account_approved',
            message: 'Votre compte enseignant a été approuvé.',
            read: false
          }
        })
        
        break
        
      case 'reject':
        // Rejeter un enseignant
        result = await prisma.user.update({
          where: {
            id: teacherId
          },
          data: {
            status: 'rejected',
            rejectedAt: new Date(),
            rejectionReason: data?.reason || null
          }
        })
        
        // Envoyer une notification à l'enseignant
        await prisma.notification.create({
          data: {
            userId: teacherId,
            type: 'account_rejected',
            message: 'Votre compte enseignant a été rejeté.',
            metadata: {
              reason: data?.reason || 'Aucune raison spécifiée'
            },
            read: false
          }
        })
        
        break
        
      case 'suspend':
        // Suspendre un enseignant
        result = await prisma.user.update({
          where: {
            id: teacherId
          },
          data: {
            status: 'suspended',
            suspendedAt: new Date(),
            suspensionReason: data?.reason || null
          }
        })
        
        // Envoyer une notification à l'enseignant
        await prisma.notification.create({
          data: {
            userId: teacherId,
            type: 'account_suspended',
            message: 'Votre compte enseignant a été suspendu.',
            metadata: {
              reason: data?.reason || 'Aucune raison spécifiée'
            },
            read: false
          }
        })
        
        break
        
      case 'update':
        // Mettre à jour les informations d'un enseignant
        if (!data) {
          return createError({
            statusCode: 400,
            message: 'data is required for update action'
          })
        }
        
        // Filtrer les champs autorisés à la mise à jour
        const allowedFields = ['bio', 'hourlyRate', 'availability', 'subjectIds']
        const updateData: any = {}
        
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            updateData[field] = data[field]
          }
        })
        
        result = await prisma.user.update({
          where: {
            id: teacherId
          },
          data: updateData
        })
        
        // Envoyer une notification à l'enseignant
        await prisma.notification.create({
          data: {
            userId: teacherId,
            type: 'profile_updated',
            message: 'Votre profil a été mis à jour par un administrateur.',
            read: false
          }
        })
        
        break
        
      default:
        return createError({
          statusCode: 400,
          message: `Unknown action: ${action}`
        })
    }
    
    return {
      success: true,
      teacher: result
    }
    
  } catch (error: any) {
    console.error('Error managing teacher:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'Could not perform the requested action'
    })
  }
})