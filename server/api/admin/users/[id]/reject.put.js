// API pour rejeter un professeur en attente
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
    
    // Utiliser la bonne méthode selon la version de nodemailer
    const transporter = nodemailer.default || nodemailer;
    
    return transporter.createTransport({
      host: config.smtpHost || 'smtp.gmail.com',
      port: config.smtpPort || 587,
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'import de nodemailer:', error);
    throw error;
  }
};

// Email de rejet d'approbation
async function sendRejectionEmail({ to, firstName, lastName, reason }) {
  const config = useRuntimeConfig();
  
  // Vérifier si les variables SMTP sont configurées
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;
  
  console.log('🔍 Vérification des variables SMTP:');
  console.log('SMTP_USER:', smtpUser ? '✅ Configuré' : '❌ Non configuré');
  console.log('SMTP_PASS:', smtpPass ? '✅ Configuré' : '❌ Non configuré');
  console.log('SMTP_HOST:', config.smtpHost || '❌ Non configuré');
  console.log('SMTP_PORT:', config.smtpPort || '❌ Non configuré');
  
  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    console.warn('Pour configurer l\'envoi d\'emails, ajoutez les variables suivantes dans votre fichier .env :');
    console.warn('SMTP_HOST=smtp.gmail.com');
    console.warn('SMTP_PORT=587');
    console.warn('SMTP_USER=votre-email@gmail.com');
    console.warn('SMTP_PASS=votre-mot-de-passe-app');
    console.warn('SMTP_FROM=noreply@academ-message.com');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const subject = 'Mise à jour de votre demande d\'inscription - Academ';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Demande d'inscription - Academ</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Mise à jour de votre demande</h1>
        <p>Bonjour ${firstName} ${lastName}</p>
      </div>
      <div class="content">
        <p>Nous vous remercions pour votre intérêt à rejoindre notre communauté de professeurs sur Academ.</p>
        
        <p>Après examen de votre profil, nous ne pouvons malheureusement pas approuver votre demande d'inscription en tant que professeur à ce moment.</p>
        
        ${reason ? `
        <div class="info-box">
          <h4>📝 Raison du refus :</h4>
          <p>${reason}</p>
        </div>
        ` : ''}
        
        <h3>Prochaines étapes</h3>
        <p>Cette décision n'est pas définitive. Vous pouvez :</p>
        <ul>
          <li>📚 Compléter vos qualifications ou certifications</li>
          <li>📝 Améliorer votre profil et votre présentation</li>
          <li>🔄 Soumettre une nouvelle demande dans le futur</li>
        </ul>
        
        <p>Si vous avez des questions ou souhaitez plus d'informations, n'hésitez pas à nous contacter à <strong>support@academ.com</strong>.</p>
        
        <a href="${config.baseUrl || 'https://academ.my'}" class="button">
          Retourner sur Academ
        </a>
        
        <p>Nous vous encourageons à réessayer lorsque vous aurez eu l'opportunité d'enrichir votre profil.</p>
        
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
    console.log('✅ Email de rejet envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de rejet:', error);
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

    const body = await readBody(event);
    const { reason } = body;

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
        message: 'Seuls les professeurs peuvent être rejetés'
      });
    }

    if (user.status !== 'pending') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cet utilisateur n\'est pas en attente d\'approbation'
      });
    }

    // Supprimer l'utilisateur (rejet définitif)
    const deleteResult = await database.collection('users').deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors du rejet de l\'utilisateur'
      });
    }

    // Envoyer l'email de rejet
    try {
      await sendRejectionEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        reason: reason
      });
      console.log('✅ Email de rejet envoyé à:', user.email);
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de rejet:', emailError);
      // On continue même si l'email échoue
    }

    console.log(`✅ Professeur rejeté par l'admin ${event.context.auth.user.email}:`, {
      userId: userId,
      teacherEmail: user.email,
      rejectedBy: event.context.auth.user._id,
      reason: reason || 'Non spécifiée'
    });

    return {
      success: true,
      message: `La demande de ${user.firstName} ${user.lastName} a été rejetée`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    };

  } catch (error) {
    console.error('Erreur lors du rejet du professeur:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors du rejet: ${error.message}`
    });
  }
});