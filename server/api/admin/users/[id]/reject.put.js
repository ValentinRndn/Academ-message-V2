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

// Rejection email
async function sendRejectionEmail({ to, firstName, lastName, reason }) {
  const config = useRuntimeConfig();
  
  // Vérifier si les variables SMTP sont configurées
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;
  
  console.log('🔍 Checking SMTP variables:');
  console.log('SMTP_USER:', smtpUser ? '✅ Configured' : '❌ Not configured');
  console.log('SMTP_PASS:', smtpPass ? '✅ Configured' : '❌ Not configured');
  console.log('SMTP_HOST:', config.smtpHost || '❌ Not configured');
  console.log('SMTP_PORT:', config.smtpPort || '❌ Not configured');
  
  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ SMTP variables not configured. Email not sent.');
    console.warn('To configure email sending, add the following variables to your .env file:');
    console.warn('SMTP_HOST=smtp.gmail.com');
    console.warn('SMTP_PORT=587');
    console.warn('SMTP_USER=votre-email@gmail.com');
    console.warn('SMTP_PASS=votre-mot-de-passe-app');
    console.warn('SMTP_FROM=noreply@academ-message.com');
    return { success: false, message: 'SMTP variables not configured' };
  }

  const subject = 'Update on your registration request - Academ';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Request - Academ</title>
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
        <h1>📋 Update on your request</h1>
        <p>Hello ${firstName} ${lastName}</p>
      </div>
      <div class="content">
        <p>Thank you for your interest in joining our community of teachers on Academ.</p>
        
        <p>After reviewing your profile, we unfortunately cannot approve your teacher registration request at this time.</p>
        
        ${reason ? `
        <div class="info-box">
          <h4>📝 Reason for rejection:</h4>
          <p>${reason}</p>
        </div>
        ` : ''}
        
        <h3>Next steps</h3>
        <p>This decision is not final. You can:</p>
        <ul>
          <li>📚 Complete your qualifications or certifications</li>
          <li>📝 Improve your profile and presentation</li>
          <li>🔄 Submit a new request in the future</li>
        </ul>
        
        <p>If you have any questions or would like more information, please feel free to contact us at <strong>support@academ.com</strong>.</p>
        
        <a href="${config.baseUrl || 'https://academ.my'}" class="button">
          Return to Academ
        </a>
        
        <p>We encourage you to try again when you have had the opportunity to enhance your profile.</p>
        
        <p>Best regards,<br>The Academ Team</p>
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
    console.log('✅ Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
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
        message: 'Only teachers can be rejected'
      });
    }

    if (user.status !== 'pending') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'This user is not pending approval'
      });
    }

    // Supprimer l'utilisateur (rejet définitif)
    const deleteResult = await database.collection('users').deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Error rejecting user'
      });
    }

    // Supprimer aussi l'entrée teacher si elle existe
    try {
      console.log('🗑️ Deleting potential teacher entry...');
      const teacherDeleteResult = await database.collection('teachers').deleteOne({ userId: objectId });
      
      if (teacherDeleteResult.deletedCount > 0) {
        console.log('✅ Teacher entry deleted');
      } else {
        console.log('ℹ️ No teacher entry found to delete');
      }
    } catch (teacherError) {
      console.error('❌ Error deleting teacher entry:', teacherError);
      // On continue même si la suppression teacher échoue
    }

    // Envoyer l'email de rejet
    try {
      await sendRejectionEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        reason: reason
      });
      console.log('✅ Rejection email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending rejection email:', emailError);
      // On continue même si l'email échoue
    }

    console.log(`✅ Teacher rejected by admin ${event.context.auth.user.email}:`, {
      userId: userId,
      teacherEmail: user.email,
      rejectedBy: event.context.auth.user._id,
      reason: reason || 'Non spécifiée'
    });

    return {
      success: true,
      message: `The request from ${user.firstName} ${user.lastName} has been rejected`,
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