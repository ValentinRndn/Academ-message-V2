import nodemailer from 'nodemailer';

// Configuration du transporteur email
let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    const config = useRuntimeConfig();
    
    transporter = nodemailer.createTransporter({
      host: config.SMTP_HOST,
      port: parseInt(config.SMTP_PORT),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }
  return transporter;
};

// Fonction pour envoyer un email de confirmation de réservation à l'étudiant
export const sendBookingConfirmationToStudent = async (booking) => {
  try {
    const transporter = initializeTransporter();
    const config = useRuntimeConfig();
    
    const mailOptions = {
      from: config.SMTP_FROM,
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
            <a href="${config.BASE_URL}/dashboard" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir mes cours
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Vous pouvez annuler ce cours gratuitement jusqu'à 24h avant l'heure prévue.
            <br><br>
            Pour toute question, contactez-nous à l'adresse : ${config.SMTP_FROM}
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

Consultez vos cours sur : ${config.BASE_URL}/dashboard

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
    const config = useRuntimeConfig();
    
    const mailOptions = {
      from: config.SMTP_FROM,
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
            <a href="${config.BASE_URL}/teacher/bookings" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir mes cours
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Préparez votre cours et n'hésitez pas à contacter l'étudiant si nécessaire.
            <br><br>
            Pour toute question, contactez-nous à l'adresse : ${config.SMTP_FROM}
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

Consultez vos cours sur : ${config.BASE_URL}/teacher/bookings

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