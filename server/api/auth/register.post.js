// API d'inscription
import { hashPassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { createUser, findUserByEmail } from '../../models/userModel.js';

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
    console.error('Error importing nodemailer:', error);
    throw error;
  }
};

// Email d'attente d'approbation pour les professeurs
async function sendPendingApprovalEmail({ to, firstName, lastName }) {
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
    console.warn('⚠️ SMTP variables not configured. Email not sent.');
    console.warn('To configure email sending, add the following variables to your .env file:');
    console.warn('SMTP_HOST=smtp.gmail.com');
    console.warn('SMTP_PORT=587');
    console.warn('SMTP_USER=votre-email@gmail.com');
    console.warn('SMTP_PASS=votre-mot-de-passe-app');
    console.warn('SMTP_FROM=noreply@academ-message.com');
    return { success: false, message: 'SMTP variables not configured' };
  }

  const subject = 'Your registration is under review - Academ';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Pending - Academ</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size: 48px; margin: 20px 0;">⏳</div>
        <h1>Registration Received</h1>
        <p>Hello ${firstName} ${lastName}</p>
      </div>
      
      <div class="content">
        <p>Thank you for creating your teacher account on Academ!</p>
        
        <p>Our team is currently reviewing your profile to ensure it meets our quality standards.</p>
        
        <div class="warning">
          <h4>⏱️ Processing Time</h4>
          <p>This process typically takes between <strong>24 and 48 hours</strong>.</p>
        </div>
        
        <p>Once your account is approved, we will send you a confirmation email with a link to access your teacher dashboard.</p>
        
        <p>If you have any questions, please feel free to contact our support team at <strong>support@academ.com</strong>.</p>
        
        <p>Best regards,<br>The Academ Team</p>
      </div>
      
      <div class="footer">
        <p>This email was sent automatically. Please do not reply.</p>
        <p>© 2024 Academ. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Registration Received - Academ
    
    Hello ${firstName} ${lastName},
    
    Thank you for creating your teacher account on Academ!
    
    Our team is currently reviewing your profile to ensure it meets our quality standards.
    
    Processing Time: This process typically takes between 24 and 48 hours.
    
    Once your account is approved, we will send you a confirmation email with a link to access your teacher dashboard.
    
    If you have any questions, please feel free to contact our support team at support@academ.com.
    
    Best regards,
    The Academ Team
    
    ---
    This email was sent automatically. Please do not reply.
    © 2024 Academ. All rights reserved.
  `;

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: config.smtpFrom || 'noreply@academ-message.com',
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Pending approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending pending email:', error);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { firstName, lastName, email, password, role = 'student' } = body;
    
    // Valider les données
    if (!firstName || !lastName || !email || !password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Tous les champs sont obligatoires'
      });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Cet email est déjà utilisé'
      });
    }
    
    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Déterminer le statut initial en fonction du rôle
    const initialStatus = role === 'teacher' ? 'pending' : 'active';
    
    // Créer l'utilisateur
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role,
      bio: body.bio || '',
      avatar: body.avatar || '',
      subjectIds: body.subjectIds || [],
      status: initialStatus,
      lastLoginAt: new Date()
    });
    
    // Masquer le mot de passe dans la réponse
    const { password: _, ...safeUser } = newUser;
    
    // Si c'est un professeur en attente, envoyer l'email et ne pas connecter
    if (role === 'teacher' && initialStatus === 'pending') {
      console.log('📧 Tentative d\'envoi d\'email d\'attente pour:', email);
      
      // Envoyer l'email d'attente d'approbation
      try {
        const emailResult = await sendPendingApprovalEmail({
          to: email,
          firstName,
          lastName
        });
        console.log('✅ Résultat envoi email d\'attente:', emailResult);
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email d\'attente:', {
          message: emailError.message,
          code: emailError.code,
          command: emailError.command,
          response: emailError.response,
          stack: emailError.stack
        });
        // On continue même si l'email échoue
      }
      
      return {
        user: safeUser,
        pendingApproval: true,
        message: 'Votre demande d\'inscription a été soumise. Vous recevrez un email une fois votre compte approuvé.'
      };
    }
    
    // Pour les étudiants ou autres rôles, procéder à la connexion normale
    // Générer un token JWT
    const token = generateToken({
      userId: newUser._id,
      role: newUser.role
    });
    
    // Définir le cookie avec le token
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
      path: '/'
    });
    
    return {
      user: safeUser
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'inscription'
    });
  }
});