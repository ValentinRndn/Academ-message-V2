import { connectToMongoDB } from '../../utils/mongodb.js';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const auth = event.context.auth;
    if (!auth || !auth.user || auth.user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès non autorisé'
      });
    }

    const body = await readBody(event);
    const { settings } = body;

    if (!settings) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Paramètres requis'
      });
    }

    // Validation des paramètres généraux
    if (settings.general) {
      const { platformName, contactEmail, baseUrl } = settings.general;
      
      if (platformName && platformName.trim().length > 100) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le nom de la plateforme ne peut pas dépasser 100 caractères'
        });
      }
      
      if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Email de contact invalide'
        });
      }
      
      if (baseUrl && !/^https?:\/\/.+/.test(baseUrl)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'URL de base invalide'
        });
      }
    }

    // Validation des paramètres de paiement
    if (settings.payment) {
      const { platformCommission, vatRate, minHourlyRate, maxHourlyRate } = settings.payment;
      
      if (platformCommission !== undefined && (platformCommission < 0 || platformCommission > 50)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'La commission doit être entre 0 et 50€'
        });
      }
      
      if (vatRate !== undefined && (vatRate < 0 || vatRate > 100)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le taux de TVA doit être entre 0 et 100%'
        });
      }
      
      if (minHourlyRate !== undefined && minHourlyRate < 1) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le tarif minimum doit être au moins 1€'
        });
      }
      
      if (maxHourlyRate !== undefined && maxHourlyRate > 500) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le tarif maximum ne peut pas dépasser 500€'
        });
      }
      
      if (minHourlyRate && maxHourlyRate && minHourlyRate >= maxHourlyRate) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le tarif minimum doit être inférieur au tarif maximum'
        });
      }
    }

    // Validation des paramètres de réservation
    if (settings.booking) {
      const { minDuration, maxDuration, minAdvanceBooking, minCancelAdvance } = settings.booking;
      
      if (minDuration !== undefined && ![15, 30, 60].includes(minDuration)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Durée minimum invalide'
        });
      }
      
      if (maxDuration !== undefined && ![120, 180, 240, 300].includes(maxDuration)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Durée maximum invalide'
        });
      }
      
      if (minAdvanceBooking !== undefined && (minAdvanceBooking < 1 || minAdvanceBooking > 72)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le préavis de réservation doit être entre 1 et 72 heures'
        });
      }
      
      if (minCancelAdvance !== undefined && (minCancelAdvance < 1 || minCancelAdvance > 72)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Le préavis d\'annulation doit être entre 1 et 72 heures'
        });
      }
    }

    // Validation des paramètres de notification
    if (settings.notifications) {
      const { fromEmail } = settings.notifications;
      
      if (fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Email expéditeur invalide'
        });
      }
    }

    const db = await connectToMongoDB();
    
    // Mettre à jour les paramètres
    const updateData = {
      ...settings,
      updatedAt: new Date()
    };

    const result = await db.collection('settings').updateOne(
      { _id: 'global' },
      { $set: updateData },
      { upsert: true }
    );

    console.log(`Paramètres mis à jour par l'admin ${auth.user.email}`);

    return {
      success: true,
      message: 'Paramètres sauvegardés avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la sauvegarde des paramètres'
    });
  }
});