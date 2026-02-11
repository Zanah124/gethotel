import Reservation from '../../models/Reservation.js';
import Chambre from '../../models/Chambre.js';
import Hotel from '../../models/Hotel.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import { Op } from 'sequelize';

// Lister les réservations de l'hôtel de l'employé (avec filtres possibles)
export const getReservations = async (req, res) => {
  try {
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;
    const { statut, page = 1, limit = 10, search } = req.query;

    const where = { hotel_id: hotelId };
    if (statut) where.statut = statut;
    if (search && search.trim()) {
      where[Op.or] = [
        { numero_reservation: { [Op.like]: `%${search.trim()}%` } },
        { '$client.nom$': { [Op.like]: `%${search.trim()}%` } },
        { '$client.prenom$': { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const lim = Math.min(parseInt(limit) || 10, 100);
    const pg = Math.max(1, parseInt(page) || 1);

    const reservations = await Reservation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: Chambre, as: 'chambre', attributes: ['id', 'numero_chambre', 'etage'] },
      ],
      order: [['date_arrivee', 'DESC']],
      limit: lim,
      offset: (pg - 1) * lim,
    });

    res.status(200).json({
      success: true,
      data: reservations.rows,
      pagination: {
        total: reservations.count,
        page: pg,
        pages: Math.ceil(reservations.count / lim),
        limit: lim,
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
    const hotelId = req.hotelId ?? employee.hotel_id;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: hotelId },
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

// Confirmer une réservation (en_attente → confirmee) + notification client avec numéro
export const confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: hotelId, statut: 'en_attente' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non confirmable' });
    }

    reservation.statut = 'confirmee';
    reservation.verified_by = employee.id;
    reservation.is_verified = 1;
    await reservation.save();

    const msg = reservation.numero_reservation
      ? `Votre réservation a été confirmée par l'hôtel. Numéro : ${reservation.numero_reservation}`
      : `Votre réservation a été confirmée par l'hôtel.`;

    await Notification.create({
      user_id: reservation.client_id,
      message: msg,
      type: 'reservation_confirmed',
      reservation_id: reservation.id,
      numero_reservation: reservation.numero_reservation || null,
      read: false,
    });

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
    const hotelId = req.hotelId ?? employee.hotel_id;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: hotelId, statut: 'confirmee' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non prête pour check-in' });
    }

    // Mettre à jour réservation + enregistrer l'heure réelle du check-in
    reservation.statut = 'check_in';
    reservation.date_check_in = new Date();
    await reservation.save();

    // Mettre à jour statut chambre (occupée)
    if (reservation.chambre) {
      reservation.chambre.statut = 'occupee';
      await reservation.chambre.save();
    }

    res.status(200).json({ success: true, message: 'Check-in effectué avec succès', data: reservation });
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
    const hotelId = req.hotelId ?? employee.hotel_id;

    const reservation = await Reservation.findOne({
      where: { id, hotel_id: hotelId, statut: 'check_in' },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou non prête pour check-out' });
    }

    // Mettre à jour réservation + enregistrer l'heure réelle du check-out
    reservation.statut = 'terminee';
    reservation.date_check_out = new Date();
    await reservation.save();

    // Libérer la chambre (nettoyage puis disponible)
    if (reservation.chambre) {
      reservation.chambre.statut = 'nettoyage';
      await reservation.chambre.save();
    }

    res.status(200).json({ success: true, message: 'Check-out effectué avec succès', data: reservation });
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

    const hotelId = req.hotelId ?? employee.hotel_id;
    const reservation = await Reservation.findOne({
      where: {
        id,
        hotel_id: hotelId,
        statut: { [Op.in]: ['en_attente', 'confirmee'] },
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