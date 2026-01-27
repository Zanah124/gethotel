import Reservation from '../../models/Reservation.js';
import Chambre from '../../models/Chambre.js';
import Hotel from '../../models/Hotel.js';
import User from '../../models/User.js';
//import { sendNotification } from '../../services/notificationService.js'; // À créer ou adapter
//import { sendEmail } from '../../services/emailService.js'; // Optionnel

// Lister les réservations de l'hôtel de l'employé (avec filtres possibles)
export const getReservations = async (req, res) => {
  try {
    const employee = req.user; // Injecté par middleware auth + roleCheck
    const { statut, page = 1, limit = 10, search } = req.query;

    const where = { hotel_id: employee.hotel_id };
    if (statut) where.statut = statut;
    if (search) {
      where.$or = [
        { numero_reservation: { $like: `%${search}%` } },
        { '$client.nom$': { $like: `%${search}%` } },
        { '$client.prenom$': { $like: `%${search}%` } },
      ];
    }

    const reservations = await Reservation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: Chambre, as: 'chambre', attributes: ['id', 'numero_chambre', 'etage'] },
      ],
      order: [['date_arrivee', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      success: true,
      data: reservations.rows,
      pagination: {
        total: reservations.count,
        page: parseInt(page),
        pages: Math.ceil(reservations.count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Erreur getReservations employee:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Voir le détail d'une réservation
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: employee.hotel_id },
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: Chambre, as: 'chambre', attributes: ['id', 'numero_chambre', 'etage', 'statut'] },
        { model: User, as: 'createur', attributes: ['nom', 'prenom'] },
        { model: User, as: 'verificateur', attributes: ['nom', 'prenom'] },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.error('Erreur getReservationById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Confirmer une réservation (en_attente → confirmee)
export const confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: employee.hotel_id, statut: 'en_attente' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non confirmable' });
    }

    reservation.statut = 'confirmee';
    reservation.verified_by = employee.id;
    reservation.is_verified = 1;
    await reservation.save();

    // Notification au client (optionnel)
    // await sendNotification(reservation.client_id, 'Votre réservation a été confirmée !');

    res.status(200).json({ success: true, message: 'Réservation confirmée avec succès', data: reservation });
  } catch (error) {
    console.error('Erreur confirmReservation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Check-in : arrivée du client
export const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: employee.hotel_id, statut: 'confirmee' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non prête pour check-in' });
    }

    // Mettre à jour réservation
    reservation.statut = 'check_in';
    await reservation.save();

    // Mettre à jour statut chambre
    if (reservation.chambre) {
      reservation.chambre.statut = 'occupee';
      await reservation.chambre.save();
    }

    res.status(200).json({ success: true, message: 'Check-in effectué avec succès' });
  } catch (error) {
    console.error('Erreur checkIn:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Check-out : départ du client
export const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: employee.hotel_id, statut: 'check_in' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non prête pour check-out' });
    }

    // Mettre à jour réservation
    reservation.statut = 'terminee';
    await reservation.save();

    // Libérer la chambre
    if (reservation.chambre) {
      reservation.chambre.statut = 'nettoyage'; // ou 'disponible' selon politique
      await reservation.chambre.save();
    }

    res.status(200).json({ success: true, message: 'Check-out effectué avec succès' });
  } catch (error) {
    console.error('Erreur checkOut:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Annuler une réservation (par employé)
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { motif } = req.body;
    const employee = req.user;

    const reservation = await Reservation.findOne({
      where: {
        id,
        hotel_id: employee.hotel_id,
        statut: { $in: ['en_attente', 'confirmee'] },
      },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non annulable' });
    }

    reservation.statut = 'annulee';
    await reservation.save();

    // Libérer la chambre si déjà occupée ou réservée
    if (reservation.chambre && reservation.chambre.statut === 'occupee') {
      reservation.chambre.statut = 'disponible';
      await reservation.chambre.save();
    }

    res.status(200).json({ success: true, message: 'Réservation annulée avec succès' });
  } catch (error) {
    console.error('Erreur cancelReservation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};