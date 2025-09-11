// API pour approuver un professeur en attente
import { MongoClient, ObjectId } from 'mongodb';
import Teacher from '../../../../models/Teacher.js';

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

// Email de confirmation d'approbation
async function sendApprovalConfirmationEmail({ to, firstName, lastName }) {
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
    console.warn('SMTP_USER=your-email@gmail.com');
    console.warn('SMTP_PASS=your-app-password');
    console.warn('SMTP_FROM=noreply@academ-message.com');
    return { success: false, message: 'SMTP variables not configured' };
  }

  const subject = 'Congratulations! Your teacher account has been approved - Academ';
  const baseUrl = config.baseUrl || 'https://academ.my';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Approved - Academ</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Congratulations!</h1>
        <p>Your account has been approved</p>
      </div>
      <div class="content">
        <p>Hello ${firstName} ${lastName},</p>
        <p><strong>Great news!</strong> Your teacher profile has been approved by our team.</p>
        <p>You can now access your teacher dashboard and start teaching on Academ.</p>
        <a href="${baseUrl}/login" class="button">🚀 Access my teacher dashboard</a>
        <p>Welcome to the Academ community!</p>
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
    console.log('✅ Approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
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
        message: 'Only teachers can be approved'
      });
    }

    if (user.status !== 'pending') {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'This user is not pending approval'
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
        message: 'Error approving user'
      });
    }

    // Créer l'entrée dans la table teachers
    try {
      console.log('📚 Creating entry in teachers table...');
      
      // Vérifier si une entrée existe déjà
      const existingTeacher = await database.collection('teachers').findOne({ userId: objectId });
      
      if (!existingTeacher) {
        const teacherData = {
          userId: objectId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio || '',
          avatar: user.avatar || '',
          subjects: user.subjectIds || [],
          availability: [],
          hourlyRate: 30, // Tarif par défaut
          languages: ['french'],
          experience: user.experience || 0,
          averageRating: 0,
          reviewCount: 0,
          sessionsCompleted: 0,
          status: 'active',
          stripeCustomerId: null,
          stripeAccountId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const teacherResult = await database.collection('teachers').insertOne(teacherData);
        
        if (teacherResult.insertedId) {
          console.log('✅ Teacher entry created with ID:', teacherResult.insertedId);
        } else {
          console.warn('⚠️ Issue creating teacher entry');
        }
      } else {
        console.log('✅ Existing teacher entry found:', existingTeacher._id);
        
        // Mettre à jour le statut si nécessaire
        if (existingTeacher.status !== 'active') {
          await database.collection('teachers').updateOne(
            { _id: existingTeacher._id },
            { 
              $set: {
                status: 'active',
                updatedAt: new Date()
              }
            }
          );
          console.log('✅ Teacher status updated to "active"');
        }
      }
    } catch (teacherError) {
      console.error('❌ Error creating/updating teacher entry:', teacherError);
      // On continue même si la création teacher échoue pour ne pas bloquer l'approbation
    }

    // Envoyer l'email de confirmation d'approbation
    try {
      await sendApprovalConfirmationEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log('✅ Approval email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending approval email:', emailError);
      // On continue même si l'email échoue
    }

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await database.collection('users').findOne({ _id: objectId });

    console.log(`✅ Teacher approved by admin ${event.context.auth.user.email}:`, {
      userId: userId,
      teacherEmail: user.email,
      approvedBy: event.context.auth.user._id
    });

    return {
      success: true,
      message: `Teacher ${user.firstName} ${user.lastName} has been successfully approved and added to the teachers database`,
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