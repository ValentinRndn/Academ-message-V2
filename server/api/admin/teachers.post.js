// API pour créer un professeur (admin seulement)
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

// Configuration du transporteur email (à adapter selon votre fournisseur)
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

// Email de bienvenue pour les nouveaux professeurs
async function sendWelcomeEmail({ to, firstName, lastName, email, password, role }) {
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

  const subject = 'Bienvenue sur Academ Message - Vos identifiants de connexion';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur Academ Message</title>
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
        .credentials {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .credential-item:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #495057;
        }
        .value {
          font-family: monospace;
          background: #f8f9fa;
          padding: 5px 10px;
          border-radius: 4px;
          color: #495057;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
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
        <h1>🎓 Bienvenue sur Academ Message</h1>
        <p>Bonjour ${firstName} ${lastName}</p>
      </div>
      
      <div class="content">
        <p>Nous sommes ravis de vous accueillir sur la plateforme Academ Message !</p>
        
        <p>Votre compte professeur a été créé avec succès. Voici vos identifiants de connexion :</p>
        
        <div class="credentials">
          <div class="credential-item">
            <span class="label">Email :</span>
            <span class="value">${email}</span>
          </div>
          <div class="credential-item">
            <span class="label">Mot de passe temporaire :</span>
            <span class="value">${password}</span>
          </div>
        </div>
        
        <div class="warning">
          <strong>⚠️ Important :</strong> Pour des raisons de sécurité, vous devrez changer votre mot de passe lors de votre première connexion.
        </div>
        
        <p>Vous pouvez dès maintenant vous connecter à votre espace professeur :</p>
        
        <a href="${config.baseUrl || 'http://localhost:3000'}/login" class="button">
          Se connecter
        </a>
        
        <h3>Que pouvez-vous faire sur Academ Message ?</h3>
        <ul>
          <li>📚 Gérer vos matières et spécialités</li>
          <li>📅 Définir vos disponibilités</li>
          <li>👥 Recevoir des demandes de cours</li>
          <li>💬 Communiquer avec vos étudiants</li>
          <li>⭐ Recevoir des avis et évaluations</li>
        </ul>
        
        <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe support.</p>
        
        <p>Cordialement,<br>L'équipe Academ Message</p>
      </div>
      
      <div class="footer">
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>© 2024 Academ Message. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Bienvenue sur Academ Message !
    
    Bonjour ${firstName} ${lastName},
    
    Nous sommes ravis de vous accueillir sur la plateforme Academ Message !
    
    Votre compte professeur a été créé avec succès. Voici vos identifiants de connexion :
    
    Email: ${email}
    Mot de passe temporaire: ${password}
    
    IMPORTANT: Pour des raisons de sécurité, vous devrez changer votre mot de passe lors de votre première connexion.
    
    Vous pouvez dès maintenant vous connecter à votre espace professeur sur: ${config.baseUrl || 'http://localhost:3000'}/login
    
    Que pouvez-vous faire sur Academ Message ?
    - Gérer vos matières et spécialités
    - Définir vos disponibilités
    - Recevoir des demandes de cours
    - Communiquer avec vos étudiants
    - Recevoir des avis et évaluations
    
    Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe support.
    
    Cordialement,
    L'équipe Academ Message
    
    ---
    Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
    © 2024 Academ Message. Tous droits réservés.
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
    console.log('✅ Email de bienvenue envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    throw error;
  }
}

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

    const body = await readBody(event);
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience,
      bio,
      subjects,
      password
    } = body;

    // Validation des données
    if (!firstName || !lastName || !email || !specialization || !password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Format d\'email invalide'
      });
    }

    const database = await connectToMongoDB();

    // Vérifier si l'email existe déjà
    const existingUser = await database.collection('User').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur professeur
    const teacherData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      role: 'teacher',
      status: 'active',
      specialization: specialization.trim(),
      experience: experience ? parseInt(experience) : 0,
      bio: bio?.trim() || '',
      subjects: subjects || [],
      password: hashedPassword,
      isFirstLogin: true, // Flag pour forcer le changement de mot de passe
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      emailVerified: false,
      profileCompleted: false
    };

    // Insérer le professeur dans la base de données
    const result = await database.collection('User').insertOne(teacherData);

    if (!result.insertedId) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de la création du professeur'
      });
    }

    // Récupérer le professeur créé (sans le mot de passe)
    const createdTeacher = await database.collection('User').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );

    // Envoyer un email de bienvenue avec les identifiants
    let emailResult = null;
    try {
      emailResult = await sendWelcomeEmail({
        to: email,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password, // Mot de passe en clair pour l'email
        role: 'teacher'
      });
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      emailResult = { success: false, message: emailError.message };
    }

    console.log(`✅ Professeur créé par l'admin ${event.context.auth.user.email}:`, {
      teacherId: result.insertedId,
      teacherEmail: email,
      createdBy: event.context.auth.user._id,
      emailSent: emailResult?.success || false
    });

    return {
      success: true,
      message: 'Professeur créé avec succès',
      teacher: createdTeacher,
      emailSent: emailResult?.success || false,
      emailMessage: emailResult?.message || 'Email non envoyé'
    };

  } catch (error) {
    console.error('Erreur lors de la création du professeur:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la création du professeur'
    });
  }
});
