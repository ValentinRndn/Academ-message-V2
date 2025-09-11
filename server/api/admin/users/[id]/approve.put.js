// API pour approuver un professeur en attente
import { MongoClient, ObjectId } from 'mongodb';

// Singleton pour maintenir la connexion à MongoDB
let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) {
    return db;
  }

  const config = useRuntimeConfig();
  const url = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
  
  try {
    if (!client) {
      client = new MongoClient(url);
      await client.connect();
      console.log('Connexion à MongoDB établie');
    }
    
    db = client.db();
    return db;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

// Configuration du transporteur email
const createTransporter = async () => {
  try {
    const nodemailer = await import('nodemailer');
    const config = useRuntimeConfig();
    
    return nodemailer.default.createTransporter({
      host: config.smtpHost || 'smtp.gmail.com',
      port: config.smtpPort || 587,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du transporteur email:', error);
    throw error;
  }
};

// Email de confirmation d'approbation
async function sendApprovalConfirmationEmail({ to, firstName, lastName }) {
  const config = useRuntimeConfig();
  
  if (!config.smtpUser || !config.smtpPass) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const subject = 'Félicitations ! Votre compte professeur a été approuvé - Academ';
  const baseUrl = config.baseUrl || 'https://academ.my';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Compte approuvé - Academ</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Félicitations !</h1>
        <p>Votre compte a été approuvé</p>
      </div>
      <div class="content">
        <p>Bonjour ${firstName} ${lastName},</p>
        <p><strong>Excellente nouvelle !</strong> Votre profil de professeur a été approuvé par notre équipe.</p>
        <p>Vous pouvez maintenant accéder à votre espace professeur et commencer à enseigner sur Academ.</p>
        <a href="${baseUrl}/login" class="button">🚀 Accéder à mon espace professeur</a>
        <p>Bienvenue dans la communauté Academ !</p>
        <p>Cordialement,<br>L'équipe Academ</p>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: config.smtpFrom || 'noreply@academ-message.com',
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email d\'approbation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email d\'approbation:', error);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification et le rôle admin
    if (!event.context.auth?.user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    if (event.context.auth.user.role !== 'admin') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Accès réservé aux administrateurs'
      });
    }

    const userId = getRouterParam(event, 'id');
    if (!userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'ID utilisateur requis'
      });
    }

    const database = await connectToMongoDB();

    // Récupérer l'utilisateur
    const objectId = new ObjectId(userId);
    const user = await database.collection('users').findOne({ _id: objectId });
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que c'est un professeur en attente
    if (user.role !== 'teacher') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Seuls les professeurs peuvent être approuvés'
      });
    }

    if (user.status !== 'pending') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cet utilisateur n\'est pas en attente d\'approbation'
      });
    }

    // Mettre à jour le statut à "active"
    const updateResult = await database.collection('users').updateOne(
      { _id: objectId },
      { 
        $set: {
          status: 'active',
          approvedAt: new Date(),
          approvedBy: new ObjectId(event.context.auth.user._id),
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de l\'approbation de l\'utilisateur'
      });
    }

    // Envoyer l'email de confirmation d'approbation
    try {
      await sendApprovalConfirmationEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log('✅ Email d\'approbation envoyé à:', user.email);
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email d\'approbation:', emailError);
      // On continue même si l'email échoue
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await database.collection('users').findOne({ _id: objectId });

    console.log(`✅ Professeur approuvé par l'admin ${event.context.auth.user.email}:`, {
      userId: userId,
      teacherEmail: user.email,
      approvedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Le professeur ${user.firstName} ${user.lastName} a été approuvé avec succès`,
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        approvedAt: updatedUser.approvedAt
      }
    };

  } catch (error) {
    console.error('Erreur lors de l\'approbation du professeur:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de l\'approbation: ${error.message}`
    });
  }
});