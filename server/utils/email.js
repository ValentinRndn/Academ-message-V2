// Service d'envoi d'email réutilisable
import nodemailer from 'nodemailer';

// Configuration du transporteur email
const createTransporter = async () => {
  try {
    const config = useRuntimeConfig();
    
    return nodemailer.createTransporter({
      host: config.smtpHost || 'smtp.gmail.com',
      port: config.smtpPort || 587,
      secure: false, // true pour 465, false pour les autres ports
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

// Vérifier la configuration SMTP
export const checkEmailConfig = () => {
  const config = useRuntimeConfig();
  
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;
  
  console.log('🔍 Vérification des variables SMTP:');
  console.log('SMTP_USER:', smtpUser ? '✅ Configuré' : '❌ Non configuré');
  console.log('SMTP_PASS:', smtpPass ? '✅ Configuré' : '❌ Non configuré');
  console.log('SMTP_HOST:', config.smtpHost || '❌ Non configuré');
  console.log('SMTP_PORT:', config.smtpPort || '❌ Non configuré');
  
  return smtpUser && smtpPass;
};

// Email d'attente d'approbation pour les professeurs
export async function sendPendingApprovalEmail({ to, firstName, lastName }) {
  if (!checkEmailConfig()) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const config = useRuntimeConfig();
  const subject = 'Votre inscription est en cours de vérification - Academ';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inscription en attente - Academ</title>
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
        .status-icon {
          font-size: 48px;
          margin: 20px 0;
        }
        .info-box {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .timeline {
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
        <div class="status-icon">⏳</div>
        <h1>Inscription reçue</h1>
        <p>Bonjour ${firstName} ${lastName}</p>
      </div>
      
      <div class="content">
        <p>Merci d'avoir créé votre compte professeur sur Academ !</p>
        
        <div class="info-box">
          <h3>📋 Votre demande est en cours de vérification</h3>
          <p>Notre équipe examine actuellement votre profil pour s'assurer qu'il respecte nos standards de qualité.</p>
        </div>
        
        <div class="timeline">
          <h4>⏱️ Délai de traitement</h4>
          <p>Ce processus prend généralement entre <strong>24 et 48 heures</strong>.</p>
        </div>
        
        <h3>Que se passe-t-il ensuite ?</h3>
        <ol>
          <li>Un administrateur examine votre profil</li>
          <li>Nous vérifions vos qualifications</li>
          <li>Vous recevez un email de confirmation une fois approuvé</li>
          <li>Vous pourrez alors accéder à votre espace professeur</li>
        </ol>
        
        <div class="info-box">
          <h4>📧 Notification par email</h4>
          <p>Dès que votre compte sera approuvé, nous vous enverrons un email de confirmation avec un lien pour accéder à votre espace professeur.</p>
        </div>
        
        <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe support à <strong>support@academ.com</strong>.</p>
        
        <p>Cordialement,<br>L'équipe Academ</p>
      </div>
      
      <div class="footer">
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>© 2024 Academ. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Inscription reçue - Academ
    
    Bonjour ${firstName} ${lastName},
    
    Merci d'avoir créé votre compte professeur sur Academ !
    
    Votre demande est en cours de vérification
    Notre équipe examine actuellement votre profil pour s'assurer qu'il respecte nos standards de qualité.
    
    Délai de traitement : Ce processus prend généralement entre 24 et 48 heures.
    
    Que se passe-t-il ensuite ?
    1. Un administrateur examine votre profil
    2. Nous vérifions vos qualifications
    3. Vous recevez un email de confirmation une fois approuvé
    4. Vous pourrez alors accéder à votre espace professeur
    
    Dès que votre compte sera approuvé, nous vous enverrons un email de confirmation avec un lien pour accéder à votre espace professeur.
    
    Si vous avez des questions, n'hésitez pas à contacter notre équipe support à support@academ.com.
    
    Cordialement,
    L'équipe Academ
    
    ---
    Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
    © 2024 Academ. Tous droits réservés.
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
    console.log('✅ Email d\'attente d\'approbation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email d\'attente:', error);
    throw error;
  }
}

// Email de confirmation d'approbation pour les professeurs
export async function sendApprovalConfirmationEmail({ to, firstName, lastName, loginUrl }) {
  if (!checkEmailConfig()) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  const config = useRuntimeConfig();
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
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
        .success-icon {
          font-size: 48px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .features {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
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
        <div class="success-icon">🎉</div>
        <h1>Félicitations !</h1>
        <p>Votre compte a été approuvé</p>
      </div>
      
      <div class="content">
        <p>Bonjour ${firstName} ${lastName},</p>
        
        <p><strong>Excellente nouvelle !</strong> Votre profil de professeur a été approuvé par notre équipe.</p>
        
        <p>Vous pouvez maintenant accéder à votre espace professeur et commencer à enseigner sur Academ.</p>
        
        <a href="${baseUrl}/login" class="button">
          🚀 Accéder à mon espace professeur
        </a>
        
        <div class="features">
          <h3>🎓 Ce que vous pouvez faire maintenant :</h3>
          <ul>
            <li>📚 Compléter votre profil et ajouter vos spécialités</li>
            <li>📅 Définir vos créneaux de disponibilité</li>
            <li>👥 Recevoir et accepter des demandes de cours</li>
            <li>💬 Communiquer avec vos étudiants</li>
            <li>⭐ Construire votre réputation grâce aux avis</li>
            <li>💰 Gérer vos revenus et vos paiements</li>
          </ul>
        </div>
        
        <h3>📋 Prochaines étapes recommandées :</h3>
        <ol>
          <li><strong>Complétez votre profil</strong> - Ajoutez une photo, votre bio et vos qualifications</li>
          <li><strong>Configurez vos disponibilités</strong> - Indiquez quand vous êtes disponible pour enseigner</li>
          <li><strong>Définissez vos tarifs</strong> - Fixez vos prix par heure selon vos matières</li>
          <li><strong>Activez les notifications</strong> - Restez informé des nouvelles demandes</li>
        </ol>
        
        <p>Notre équipe support reste à votre disposition pour toute question : <strong>support@academ.com</strong></p>
        
        <p>Bienvenue dans la communauté Academ ! Nous avons hâte de voir vos premiers cours.</p>
        
        <p>Cordialement,<br>L'équipe Academ</p>
      </div>
      
      <div class="footer">
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>© 2024 Academ. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Félicitations ! Votre compte professeur a été approuvé - Academ
    
    Bonjour ${firstName} ${lastName},
    
    Excellente nouvelle ! Votre profil de professeur a été approuvé par notre équipe.
    
    Vous pouvez maintenant accéder à votre espace professeur et commencer à enseigner sur Academ.
    
    👉 Connectez-vous dès maintenant : ${baseUrl}/login
    
    Ce que vous pouvez faire maintenant :
    - Compléter votre profil et ajouter vos spécialités
    - Définir vos créneaux de disponibilité
    - Recevoir et accepter des demandes de cours
    - Communiquer avec vos étudiants
    - Construire votre réputation grâce aux avis
    - Gérer vos revenus et vos paiements
    
    Prochaines étapes recommandées :
    1. Complétez votre profil - Ajoutez une photo, votre bio et vos qualifications
    2. Configurez vos disponibilités - Indiquez quand vous êtes disponible pour enseigner
    3. Définissez vos tarifs - Fixez vos prix par heure selon vos matières
    4. Activez les notifications - Restez informé des nouvelles demandes
    
    Notre équipe support reste à votre disposition pour toute question : support@academ.com
    
    Bienvenue dans la communauté Academ ! Nous avons hâte de voir vos premiers cours.
    
    Cordialement,
    L'équipe Academ
    
    ---
    Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
    © 2024 Academ. Tous droits réservés.
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
    console.log('✅ Email de confirmation d\'approbation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
}

// Fonction générique d'envoi d'email
export async function sendEmail({ to, subject, text, html }) {
  if (!checkEmailConfig()) {
    console.warn('⚠️ Variables SMTP non configurées. Email non envoyé.');
    return { success: false, message: 'Variables SMTP non configurées' };
  }

  try {
    const config = useRuntimeConfig();
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: config.smtpFrom || 'noreply@academ-message.com',
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}