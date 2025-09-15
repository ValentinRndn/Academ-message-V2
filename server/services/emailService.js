import nodemailer from 'nodemailer';

// Configuration du transporteur email
let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    // Utiliser directement process.env au lieu de useRuntimeConfig pour éviter les problèmes de contexte
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

// Fonction pour envoyer un email de confirmation de réservation à l'étudiant
export const sendBookingConfirmationToStudent = async (booking) => {
  try {
    const transporter = initializeTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: booking.studentId.email,
      subject: '✅ Votre cours a été confirmé - Academ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Votre cours a été confirmé !</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Détails de votre cours :</h3>
            <p><strong>Professeur :</strong> ${booking.teacherId.firstName} ${booking.teacherId.lastName}</p>
            <p><strong>Matière :</strong> ${booking.subjectId.name}</p>
            <p><strong>Date :</strong> ${new Date(booking.startTime).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Horaire :</strong> ${new Date(booking.startTime).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} - ${new Date(booking.endTime).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</p>
            <p><strong>Durée :</strong> ${booking.duration} minutes</p>
            <p><strong>Montant payé :</strong> ${booking.totalAmount}€</p>
          </div>

          ${booking.studentNotes ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>Vos notes :</h4>
              <p>${booking.studentNotes}</p>
            </div>
          ` : ''}

          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.BASE_URL}/dashboard" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir mes cours
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Vous pouvez annuler ce cours gratuitement jusqu'à 24h avant l'heure prévue.
            <br><br>
            Pour toute question, contactez-nous à l'adresse : ${process.env.SMTP_FROM}
          </p>
        </div>
      `,
      text: `
Votre cours a été confirmé !

Détails de votre cours :
- Professeur : ${booking.teacherId.firstName} ${booking.teacherId.lastName}
- Matière : ${booking.subjectId.name}
- Date : ${new Date(booking.startTime).toLocaleDateString('fr-FR')}
- Horaire : ${new Date(booking.startTime).toLocaleTimeString('fr-FR')} - ${new Date(booking.endTime).toLocaleTimeString('fr-FR')}
- Durée : ${booking.duration} minutes
- Montant payé : ${booking.totalAmount}€

${booking.studentNotes ? `Vos notes : ${booking.studentNotes}` : ''}

Consultez vos cours sur : ${process.env.BASE_URL}/dashboard

Vous pouvez annuler ce cours gratuitement jusqu'à 24h avant l'heure prévue.
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmation étudiant envoyé: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email à l\'étudiant:', error);
    throw error;
  }
};

// Fonction pour envoyer une notification de nouvelle réservation au professeur
export const sendBookingNotificationToTeacher = async (booking) => {
  try {
    const transporter = initializeTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: booking.teacherId.email,
      subject: '📚 Nouvelle réservation de cours - Academ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Nouvelle réservation confirmée !</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Détails du cours :</h3>
            <p><strong>Étudiant :</strong> ${booking.studentId.firstName} ${booking.studentId.lastName}</p>
            <p><strong>Email étudiant :</strong> ${booking.studentId.email}</p>
            <p><strong>Matière :</strong> ${booking.subjectId.name}</p>
            <p><strong>Date :</strong> ${new Date(booking.startTime).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Horaire :</strong> ${new Date(booking.startTime).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} - ${new Date(booking.endTime).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</p>
            <p><strong>Durée :</strong> ${booking.duration} minutes</p>
            <p><strong>Votre rémunération :</strong> ${booking.teacherAmount}€</p>
          </div>

          ${booking.studentNotes ? `
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>Notes de l'étudiant :</h4>
              <p>${booking.studentNotes}</p>
            </div>
          ` : ''}

          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.BASE_URL}/teacher/bookings" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir mes cours
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Préparez votre cours et n'hésitez pas à contacter l'étudiant si nécessaire.
            <br><br>
            Pour toute question, contactez-nous à l'adresse : ${process.env.SMTP_FROM}
          </p>
        </div>
      `,
      text: `
Nouvelle réservation confirmée !

Détails du cours :
- Étudiant : ${booking.studentId.firstName} ${booking.studentId.lastName}
- Email étudiant : ${booking.studentId.email}
- Matière : ${booking.subjectId.name}
- Date : ${new Date(booking.startTime).toLocaleDateString('fr-FR')}
- Horaire : ${new Date(booking.startTime).toLocaleTimeString('fr-FR')} - ${new Date(booking.endTime).toLocaleTimeString('fr-FR')}
- Durée : ${booking.duration} minutes
- Votre rémunération : ${booking.teacherAmount}€

${booking.studentNotes ? `Notes de l'étudiant : ${booking.studentNotes}` : ''}

Consultez vos cours sur : ${process.env.BASE_URL}/teacher/bookings

Préparez votre cours et n'hésitez pas à contacter l'étudiant si nécessaire.
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email de notification professeur envoyé: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email au professeur:', error);
    throw error;
  }
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = initializeTransporter();
    
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: '🔒 Réinitialisation de votre mot de passe - Academ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Réinitialisation de votre mot de passe</h2>
          
          <p>Bonjour ${user.firstName} ${user.lastName},</p>
          
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur Academ.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          </div>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>⚠️ Important :</strong> Ce lien expirera dans 1 heure pour des raisons de sécurité.
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Pour toute question, contactez-nous à l'adresse : ${process.env.SMTP_FROM}
          </p>
        </div>
      `,
      text: `
Réinitialisation de votre mot de passe

Bonjour ${user.firstName} ${user.lastName},

Vous avez demandé la réinitialisation de votre mot de passe sur Academ.

Cliquez sur ce lien pour définir un nouveau mot de passe :
${resetUrl}

Ce lien expirera dans 1 heure pour des raisons de sécurité.

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.

Pour toute question, contactez-nous à l'adresse : ${process.env.SMTP_FROM}
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email de réinitialisation envoyé: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw error;
  }
};