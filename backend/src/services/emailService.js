// backend/src/services/emailService.js (ajout des fonctions pour client)

// Envoyer confirmation de réservation
exports.sendReservationConfirmation = async (email, reservation, chambre) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Confirmation de réservation - ${reservation.numeroReservation}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Confirmation de réservation</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Détails de votre réservation</h3>
            <p><strong>Numéro de réservation:</strong> ${reservation.numeroReservation}</p>
            <p><strong>Hôtel:</strong> ${chambre.hotel.nom}</p>
            <p><strong>Chambre:</strong> ${chambre.typeChambre.nom}</p>
            <p><strong>Date d'arrivée:</strong> ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
            <p><strong>Date de départ:</strong> ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}</p>
            <p><strong>Nombre de nuits:</strong> ${reservation.nombreNuits}</p>
            <p><strong>Nombre de personnes:</strong> ${reservation.nombrePersonnes}</p>
            <p><strong>Montant total:</strong> ${reservation.montantTotal}€</p>
          </div>

          <p style="color: #7f8c8d;">
            Votre réservation est en attente de paiement. 
            Veuillez effectuer le paiement pour confirmer votre réservation.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
            <p style="color: #95a5a6; font-size: 12px;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé à:', email);
  } catch (error) {
    console.error('Erreur envoi email confirmation:', error);
  }
};

// Envoyer confirmation de paiement
exports.sendPaymentConfirmation = async (email, data, pdfBuffer) => {
  try {
    const { paiement, reservation, facture } = data;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Paiement confirmé - ${reservation.numeroReservation}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Paiement confirmé ✓</h2>
          
          <div style="background-color: #e8f8f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p>Votre paiement de <strong>${paiement.montant}€</strong> a été confirmé avec succès.</p>
            <p><strong>Numéro de réservation:</strong> ${reservation.numeroReservation}</p>
            <p><strong>Numéro de facture:</strong> ${facture.numeroFacture}</p>
            <p><strong>Date de paiement:</strong> ${new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}</p>
          </div>

          <p>Votre réservation est maintenant confirmée. Vous trouverez votre facture en pièce jointe.</p>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Important:</strong> Veuillez présenter cette confirmation lors de votre arrivée à l'hôtel.</p>
          </div>

          <p>Nous vous souhaitons un excellent séjour !</p>
        </div>
      `,
      attachments: [
        {
          filename: `facture-${facture.numeroFacture}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de confirmation paiement envoyé à:', email);
  } catch (error) {
    console.error('Erreur envoi email paiement:', error);
  }
};

// Rappel de réservation
exports.sendReservationReminder = async (email, reservation) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Rappel - Votre séjour commence bientôt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">Votre séjour approche !</h2>
          
          <p>Nous avons hâte de vous accueillir bientôt.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Numéro de réservation:</strong> ${reservation.numeroReservation}</p>
            <p><strong>Date d'arrivée:</strong> ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure d'arrivée:</strong> À partir de 14h00</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Informations utiles :</h4>
            <ul>
              <li>Check-in : 14h00 - 22h00</li>
              <li>Check-out : Avant 11h00</li>
              <li>N'oubliez pas votre pièce d'identité</li>
            </ul>
          </div>

          <p>À très bientôt !</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur envoi rappel:', error);
  }
};