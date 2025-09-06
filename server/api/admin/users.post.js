// API pour créer un utilisateur (admin seulement) - gère étudiants et professeurs
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import Teacher from '../../models/Teacher.js';
import crypto from 'crypto';

// Configuration du transporteur email
const createTransporter = async () => {
  try {
    const nodemailer = await import('nodemailer');
    const config = useRuntimeConfig();
    
    const transporter = nodemailer.default || nodemailer;
    
    return transporter.createTransporter({
      host: config.smtpHost || 'smtp.gmail.com',
      port: config.smtpPort || 587,
      secure: false,
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

// Email de bienvenue avec lien de configuration de mot de passe
async function sendWelcomeEmail({ to, firstName, lastName, email, tempPassword, role, resetToken }) {
  const config = useRuntimeConfig();
  
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;
  
  console.log('🔍 Vérification des variables SMTP:');
  console.log('SMTP_USER:', smtpUser ? '✅ Configuré' : '❌ Non configuré');
  console.log('SMTP_PASS:', smtpPass ? '✅ Configuré' : '❌ Non configuré');
  
  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const baseUrl = config.baseUrl || 'http://localhost:3000';
  const setupPasswordUrl = `${baseUrl}/setup-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  const roleText = role === 'teacher' ? 'professeur' : 'étudiant';
  const roleColor = role === 'teacher' ? '#22c55e' : '#3b82f6';

  const subject = `Bienvenue sur Academ - Configuration de votre mot de passe`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur Academ</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .role-badge {
          display: inline-block;
          background: ${roleColor};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .credentials {
          background: #f8f9fa;
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
          font-weight: 600;
          color: #495057;
        }
        .value {
          font-family: 'Courier New', monospace;
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
          color: #495057;
          border: 1px solid #dee2e6;
        }
        .cta-button {
          display: block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 30px 0;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-1px);
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 16px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .steps {
          background: #e8f4fd;
          border-left: 4px solid #2196f3;
          padding: 20px;
          margin: 20px 0;
        }
        .steps ol {
          margin: 0;
          padding-left: 20px;
        }
        .steps li {
          margin: 8px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6c757d;
          font-size: 14px;
          padding: 20px;
          background: #f8f9fa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Bienvenue sur Academ</h1>
          <p>Bonjour ${firstName} ${lastName}</p>
        </div>
        
        <div class="content">
          <div class="role-badge">Compte ${roleText}</div>
          
          <p>Nous sommes ravis de vous accueillir sur la plateforme Academ !</p>
          
          <p>Votre compte ${roleText} a été créé avec succès par notre équipe administrative. Pour accéder à votre compte, vous devez configurer votre mot de passe.</p>
          
          <div class="credentials">
            <div class="credential-item">
              <span class="label">Email de connexion :</span>
              <span class="value">${email}</span>
            </div>
            <div class="credential-item">
              <span class="label">Mot de passe temporaire :</span>
              <span class="value">${tempPassword}</span>
            </div>
          </div>
          
          <div class="warning">
            <strong>🔐 Sécurité :</strong> Vous devez utiliser le mot de passe temporaire ci-dessus pour créer votre nouveau mot de passe sécurisé.
          </div>
          
          <div class="steps">
            <h3>📋 Étapes pour configurer votre compte :</h3>
            <ol>
              <li>Cliquez sur le bouton ci-dessous</li>
              <li>Saisissez votre mot de passe temporaire</li>
              <li>Créez votre nouveau mot de passe sécurisé</li>
              <li>Confirmez votre nouveau mot de passe</li>
              <li>Votre compte sera automatiquement activé !</li>
            </ol>
          </div>
          
          <a href="${setupPasswordUrl}" class="cta-button">
            🚀 Configurer mon mot de passe
          </a>
          
          <div style="font-size: 14px; color: #6c757d; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Lien de configuration :</strong></p>
            <p style="word-break: break-all; font-family: 'Courier New', monospace; background: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
              ${setupPasswordUrl}
            </p>
          </div>
          
          ${role === 'teacher' ? `
          <div style="margin-top: 30px;">
            <h3>🎯 Que pouvez-vous faire en tant que professeur ?</h3>
            <ul>
              <li>📚 Gérer vos matières et spécialités</li>
              <li>📅 Définir vos disponibilités</li>
              <li>👥 Recevoir des demandes de cours</li>
              <li>💬 Communiquer avec vos étudiants</li>
              <li>⭐ Recevoir des avis et évaluations</li>
              <li>💰 Gérer vos revenus</li>
            </ul>
          </div>
          ` : `
          <div style="margin-top: 30px;">
            <h3>📖 Que pouvez-vous faire en tant qu'étudiant ?</h3>
            <ul>
              <li>🔍 Rechercher des professeurs</li>
              <li>📅 Réserver des cours</li>
              <li>💬 Communiquer avec vos professeurs</li>
              <li>⭐ Laisser des avis</li>
              <li>📊 Suivre vos progrès</li>
            </ul>
          </div>
          `}
          
          <p style="margin-top: 30px;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe support.</p>
          
          <p>Cordialement,<br><strong>L'équipe Academ</strong></p>
        </div>
      </div>
      
      <div class="footer">
        <p>⏰ Ce lien de configuration expire dans 24 heures pour des raisons de sécurité.</p>
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>© 2024 Academ. Tous droits réservés.</p>
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
    console.log('✅ Email de bienvenue envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    throw error;
  }
}

// Singleton pour MongoDB
let client = null;
let db = null;

async function connectToMongoDB() {
  if (db) return db;

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
      role,
      specialization,
      experience,
      bio,
      subjects,
      password: tempPassword
    } = body;

    // Validation des données
    if (!firstName || !lastName || !email || !role || !tempPassword) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Les champs prénom, nom, email, rôle et mot de passe sont obligatoires'
      });
    }

    // Validation spécifique aux professeurs
    if (role === 'teacher' && !specialization) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'La spécialisation est obligatoire pour un professeur'
      });
    }

    // Validation des rôles autorisés
    if (!['student', 'teacher'].includes(role)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Le rôle doit être "student" ou "teacher"'
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
    const existingUser = await database.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe temporaire
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Générer un token de réinitialisation pour la configuration de mot de passe
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Créer un ID Stripe Customer si configuré
    let stripeCustomerId = null;
    let stripeAccountId = null;
    
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (stripeSecretKey) {
        const stripe = (await import('stripe')).default(stripeSecretKey);
        
        // Créer un customer Stripe
        const customer = await stripe.customers.create({
          email: email.toLowerCase().trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
          metadata: {
            role: role,
            academ_user_type: role
          }
        });
        stripeCustomerId = customer.id;
        
        // Créer un compte Stripe Connect uniquement pour les professeurs
        if (role === 'teacher') {
          const account = await stripe.accounts.create({
            type: 'express',
            email: email.toLowerCase().trim(),
            metadata: {
              teacher_name: `${firstName.trim()} ${lastName.trim()}`,
              academ_user_type: 'teacher'
            }
          });
          stripeAccountId = account.id;
          console.log(`✅ Stripe Account créé pour professeur: ${stripeAccountId}`);
        }
        
        console.log(`✅ Stripe Customer créé: ${stripeCustomerId}`);
      } else {
        console.warn('⚠️ STRIPE_SECRET_KEY non configuré, IDs Stripe non créés');
      }
    } catch (stripeError) {
      console.error('❌ Erreur lors de la création des comptes Stripe:', stripeError);
    }

    // Créer l'utilisateur dans la collection users
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      role: role,
      status: 'inactive', // Inactif jusqu'à configuration du mot de passe
      password: hashedTempPassword,
      tempPassword: tempPassword, // Stocké temporairement pour validation
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry,
      stripeCustomerId: stripeCustomerId,
      stripeAccountId: role === 'teacher' ? stripeAccountId : null,
      isFirstLogin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      emailVerified: false,
      profileCompleted: false,
      accountActivated: false // Sera activé après configuration du mot de passe
    };

    // Ajouter les champs spécifiques aux professeurs
    if (role === 'teacher') {
      userData.specialization = specialization.trim();
      userData.experience = experience ? parseInt(experience) : 0;
      userData.bio = bio?.trim() || '';
      userData.subjects = subjects || [];
    }

    // Insérer l'utilisateur dans la base de données
    const result = await database.collection('users').insertOne(userData);

    if (!result.insertedId) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de la création de l\'utilisateur'
      });
    }

    // Si c'est un professeur, créer aussi l'enregistrement Teacher
    let savedTeacher = null;
    if (role === 'teacher') {
      try {
        // S'assurer que Mongoose est connecté
        const config = useRuntimeConfig();
        const mongoUrl = config.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';
        
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(mongoUrl);
          console.log('✅ Mongoose connecté pour Teacher');
        }

        // Créer l'enregistrement correspondant dans la collection Teacher
        const teacherRecord = new Teacher({
          userId: result.insertedId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          bio: bio?.trim() || '',
          avatar: '',
          subjects: subjects || [],
          availability: [],
          hourlyRate: 50, // Tarif par défaut
          languages: ['french'],
          experience: experience ? parseInt(experience) : 0,
          averageRating: 0,
          reviewCount: 0,
          sessionsCompleted: 0,
          status: 'inactive', // Inactif jusqu'à activation du compte
          stripeCustomerId: stripeCustomerId,
          stripeAccountId: stripeAccountId
        });

        savedTeacher = await teacherRecord.save();
        console.log('✅ Teacher enregistré avec ID:', savedTeacher._id);
      } catch (teacherError) {
        console.error('❌ Erreur lors de la création du Teacher:', teacherError);
        // Nettoyer l'utilisateur si la création du Teacher échoue
        await database.collection('users').deleteOne({ _id: result.insertedId });
        throw new Error('Erreur lors de la création du profil professeur');
      }
    }

    // Récupérer l'utilisateur créé (sans le mot de passe)
    const createdUser = await database.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0, tempPassword: 0, resetPasswordToken: 0 } }
    );

    // Envoyer un email de bienvenue avec lien de configuration
    let emailResult = null;
    try {
      emailResult = await sendWelcomeEmail({
        to: email,
        firstName: firstName,
        lastName: lastName,
        email: email,
        tempPassword: tempPassword,
        role: role,
        resetToken: resetToken
      });
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      emailResult = { success: false, message: emailError.message };
    }

    console.log(`✅ Utilisateur ${role} créé par l'admin ${event.context.auth.user.email}:`, {
      userId: result.insertedId,
      teacherRecordId: savedTeacher?._id,
      userEmail: email,
      role: role,
      createdBy: event.context.auth.user._id,
      emailSent: emailResult?.success || false,
      stripeCustomerId: stripeCustomerId,
      stripeAccountId: role === 'teacher' ? stripeAccountId : null
    });

    return {
      success: true,
      message: `Utilisateur ${role} créé avec succès`,
      user: createdUser,
      teacherRecord: savedTeacher ? {
        _id: savedTeacher._id.toString(),
        userId: savedTeacher.userId.toString()
      } : null,
      emailSent: emailResult?.success || false,
      emailMessage: emailResult?.message || 'Email non envoyé',
      stripeSetup: stripeCustomerId ? 'Comptes Stripe créés' : 'Stripe non configuré'
    };

  } catch (error) {
    console.error('Erreur détaillée lors de la création de l\'utilisateur:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Erreur lors de la création de l'utilisateur: ${error.message}`
    });
  }
});