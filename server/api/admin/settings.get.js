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

    const config = useRuntimeConfig();
    const db = await connectToMongoDB();
    
    // Récupérer les paramètres depuis la base de données
    let settings = await db.collection('settings').findOne({ _id: 'global' });
    
    // Si aucun paramètre n'existe, créer les paramètres par défaut
    if (!settings) {
      settings = {
        _id: 'global',
        general: {
          platformName: 'Academ',
          platformDescription: 'Plateforme de cours particuliers en ligne',
          contactEmail: 'contact@academ.com',
          baseUrl: 'https://academ.my',
          maintenanceMode: false
        },
        payment: {
          platformCommission: 5,
          vatRate: 20,
          defaultCurrency: 'EUR',
          minHourlyRate: 10,
          maxHourlyRate: 100
        },
        booking: {
          minDuration: 30,
          maxDuration: 180,
          minAdvanceBooking: 2,
          minCancelAdvance: 24,
          autoConfirm: false
        },
        notifications: {
          emailEnabled: true,
          pushEnabled: true,
          fromEmail: 'noreply@academ.com',
          fromName: 'Academ'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('settings').insertOne(settings);
    }

    // Récupérer les informations système
    const systemInfo = {
      appVersion: '1.0.0',
      dbStatus: 'connected', // Puisqu'on arrive ici, la DB est connectée
      stripeStatus: config.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
      activeUsers: await db.collection('users').countDocuments({ 
        lastLoginAt: { 
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      })
    };

    return {
      success: true,
      settings: {
        general: settings.general,
        payment: settings.payment,
        booking: settings.booking,
        notifications: settings.notifications
      },
      systemInfo
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la récupération des paramètres'
    });
  }
});