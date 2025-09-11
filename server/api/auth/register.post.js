// API d'inscription
import { hashPassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { createUser, findUserByEmail } from '../../models/userModel.js';

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

// Email d'attente d'approbation pour les professeurs
async function sendPendingApprovalEmail({ to, firstName, lastName }) {
  const config = useRuntimeConfig();
  
  if (!config.smtpUser || !config.smtpPass) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const subject = 'Votre inscription est en cours de vérification - Academ';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inscription en attente - Academ</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⏳ Inscription reçue</h1>
        <p>Bonjour ${firstName} ${lastName}</p>
      </div>
      <div class="content">
        <p>Merci d'avoir créé votre compte professeur sur Academ !</p>
        <p>Notre équipe examine actuellement votre profil pour s'assurer qu'il respecte nos standards de qualité.</p>
        <p><strong>Ce processus prend généralement entre 24 et 48 heures.</strong></p>
        <p>Dès que votre compte sera approuvé, nous vous enverrons un email de confirmation avec un lien pour accéder à votre espace professeur.</p>
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
    console.log('✅ Email d\'attente d\'approbation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email d\'attente:', error);
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
      // Envoyer l'email d'attente d'approbation
      try {
        await sendPendingApprovalEmail({
          to: email,
          firstName,
          lastName
        });
        console.log('✅ Email d\'attente envoyé à:', email);
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email d\'attente:', emailError);
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