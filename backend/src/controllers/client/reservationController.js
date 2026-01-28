import Reservation from '../../models/Reservation.js';
import Chambre from '../../models/Chambre.js';
import Hotel from '../../models/Hotel.js';
import User from '../../models/User.js';
import TypeChambre from '../../models/TypeChambre.js';
import { Op } from 'sequelize';

// Créer une réservation (client connecté)
export const createReservation = async (req, res) => {
  try {
    const client = req.user;
    const { chambre_id, hotel_id, date_arrivee, date_depart, nombre_adultes, nombre_enfants = 0, demandes_speciales } = req.body;

    if (!chambre_id || !hotel_id || !date_arrivee || !date_depart || !nombre_adultes) {
      return res.status(400).json({
        success: false,
        message: 'chambre_id, hotel_id, date_arrivee, date_depart et nombre_adultes sont requis',
      });
    }

    const chambre = await Chambre.findOne({
      where: { id: chambre_id, hotel_id },
      include: [{ model: TypeChambre, as: 'typeChambre', attributes: ['id', 'nom', 'prix_par_nuit', 'capacite'] }],
    });

    if (!chambre || !chambre.typeChambre) {
      return res.status(404).json({ success: false, message: 'Chambre ou type non trouvé pour cet hôtel' });
    }

    const startDate = new Date(date_arrivee);
    const endDate = new Date(date_depart);
    const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const prixParNuit = parseFloat(chambre.typeChambre.prix_par_nuit);
    const prix_total = Math.round(nights * prixParNuit * 100) / 100;

    const conflit = await Reservation.count({
      where: {
        chambre_id,
        [Op.or]: [
          { date_arrivee: { [Op.lte]: endDate }, date_depart: { [Op.gte]: startDate } },
        ],
        statut: { [Op.notIn]: ['annulee', 'terminee'] },
      },
    });
    if (conflit > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cette chambre n\'est plus disponible pour les dates choisies',
      });
    }

    const numero_reservation = `RES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const reservation = await Reservation.create({
      numero_reservation,
      client_id: client.id,
      chambre_id,
      hotel_id,
      date_arrivee,
      date_depart,
      nombre_adultes: parseInt(nombre_adultes),
      nombre_enfants: parseInt(nombre_enfants) || 0,
      prix_total,
      demandes_speciales: demandes_speciales || null,
      created_by: client.id,
    });

    const created = await Reservation.findByPk(reservation.id, {
      include: [
        { model: Chambre, as: 'chambre', attributes: ['id', 'numero_chambre', 'etage'] },
        { model: Hotel, as: 'hotel', attributes: ['id', 'nom', 'ville'] },
      ],
    });

    res.status(201).json({ success: true, data: created, message: 'Réservation créée avec succès' });
  } catch (err) {
    console.error('Erreur createReservation:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création de la réservation' });
  }
};

// Lister les réservations du client connecté
export const getMyReservations = async (req, res) => {
  try {
    const client = req.user; // Injecté par middleware auth

    const { statut, page = 1, limit = 10 } = req.query;

    const where = { client_id: client.id };
    if (statut) where.statut = statut;

    const reservations = await Reservation.findAndCountAll({
      where,
      include: [
        {
          model: Chambre,
          as: 'chambre',
          attributes: ['id', 'numero_chambre', 'etage'],
          include: [
            {
              model: Hotel,
              as: 'hotel', // Assure-toi que l'association existe dans Chambre model
              attributes: ['id', 'nom', 'adresse', 'ville', 'nombre_etoiles', 'photo_principale'],
            },
          ],
        },
      ],
      order: [['date_arrivee', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
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
    console.error('Erreur getMyReservations client:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Voir le détail d'une réservation appartenant au client
export const getMyReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.user;

    const reservation = await Reservation.findOne({
      where: { id, client_id: client.id },
      include: [
        {
          model: Chambre,
          as: 'chambre',
          attributes: ['id', 'numero_chambre', 'etage', 'statut'],
          include: [
            {
              model: Hotel,
              as: 'hotel',
              attributes: ['id', 'nom', 'adresse', 'ville', 'pays', 'nombre_etoiles', 'photo_principale', 'photos', 'services'],
            },
          ],
        },
        { model: User, as: 'verificateur', attributes: ['nom', 'prenom'] },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée ou ne vous appartient pas' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.error('Erreur getMyReservationById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Annuler une réservation par le client (seulement si en_attente ou confirmee)
export const cancelMyReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.user;

    const reservation = await Reservation.findOne({
      where: {
        id,
        client_id: client.id,
        statut: { [Op.in]: ['en_attente', 'confirmee'] },
      },
      include: [{ model: Chambre, as: 'chambre' }],
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée, déjà annulée ou non annulable',
      });
    }

    // Optionnel : ajouter une logique de politique d'annulation (ex: pas après X jours avant arrivée)
    // const daysBeforeArrival = Math.ceil((new Date(reservation.date_arrivee) - new Date()) / (1000 * 60 * 60 * 24));
    // if (daysBeforeArrival < 2) {
    //   return res.status(400).json({ success: false, message: 'Annulation trop proche de la date d\'arrivée' });
    // }

    reservation.statut = 'annulee';
    await reservation.save();

    // Libérer la chambre si nécessaire
    if (reservation.chambre) {
      // Si la réservation était confirmée, on remet la chambre disponible
      if (reservation.chambre.statut === 'occupee') {
        reservation.chambre.statut = 'disponible';
      }
      // Si elle était juste réservée, on la libère aussi
      await reservation.chambre.save();
    }

    res.status(200).json({
      success: true,
      message: 'Votre réservation a été annulée avec succès',
      data: reservation,
    });
  } catch (error) {
    console.error('Erreur cancelMyReservation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};