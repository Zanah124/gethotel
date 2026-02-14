import Reservation from '../../models/Reservation.js';
import Chambre from '../../models/Chambre.js';
import TypeChambre from '../../models/TypeChambre.js';
import Hotel from '../../models/Hotel.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

// Lister les réservations de l'hôtel de l'employé (avec filtres possibles)
export const getReservations = async (req, res) => {
  try {
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;
    const { statut, page = 1, limit = 50, search } = req.query;

    const where = { hotel_id: hotelId };
    if (statut) where.statut = statut;
    if (search && search.trim()) {
      where[Op.or] = [
        { numero_reservation: { [Op.like]: `%${search.trim()}%` } },
        { '$client.nom$': { [Op.like]: `%${search.trim()}%` } },
        { '$client.prenom$': { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const lim = Math.min(parseInt(limit) || 50, 100);
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

// Créer une réservation manuelle par employé
export const createReservation = async (req, res) => {
  try {
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;

    const {
      client_id,
      client,               // { nom, prenom, email, telephone } si nouveau
      date_arrivee,
      date_depart,
      chambre_id,
      nombre_adultes,
      nombre_enfants,
      notes,
    } = req.body;

    console.log('📝 createReservation - Données reçues:', {
      client_id,
      client,
      date_arrivee,
      date_depart,
      chambre_id,
      notes
    });

    // Validation de base
    if (!date_arrivee || !date_depart || !chambre_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Les dates et la chambre sont obligatoires' 
      });
    }

    // Vérifier que les dates sont valides
    const dateArrivee = new Date(date_arrivee);
    const dateDepart = new Date(date_depart);
    
    if (dateDepart <= dateArrivee) {
      return res.status(400).json({ 
        success: false, 
        message: 'La date de départ doit être après la date d\'arrivée' 
      });
    }

    let finalClientId = client_id;

    // Créer client s'il n'existe pas
    if (!client_id && client) {
      console.log('👤 Création d\'un nouveau client...');
      
      // Vérifier que l'email n'existe pas déjà
      const existingUser = await User.findOne({ where: { email: client.email } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Un utilisateur avec cet email existe déjà' 
        });
      }

      // Générer un mot de passe par défaut
      const defaultPassword = 'Client123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const newClient = await User.create({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone || null,
        password: hashedPassword,
        role: 'client',
        hotel_id: hotelId,
        statut: 'actif',
      });
      
      finalClientId = newClient.id;
      console.log('✅ Nouveau client créé, ID:', finalClientId);
    }

    if (!finalClientId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un client existant ou les informations d\'un nouveau client sont requis' 
      });
    }

    // Vérifier disponibilité chambre + récupérer le prix
    console.log('🏨 Vérification de la chambre...');
    const chambre = await Chambre.findOne({
      where: { 
        id: chambre_id, 
        hotel_id: hotelId,
        statut: { [Op.in]: ['disponible'] }
      },
      include: [
        {
          model: TypeChambre,
          as: 'typeChambre',
          attributes: ['prix_par_nuit']
        }
      ]
    });

    if (!chambre) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chambre non disponible ou introuvable' 
      });
    }

    // Vérifier qu'il n'y a pas de réservation qui chevauche
    const conflictingReservation = await Reservation.findOne({
      where: {
        chambre_id,
        hotel_id: hotelId,
        statut: { [Op.in]: ['confirmee', 'check_in', 'en_attente'] },
        [Op.or]: [
          {
            date_arrivee: { [Op.lte]: date_depart },
            date_depart: { [Op.gte]: date_arrivee },
          },
        ],
      },
    });

    if (conflictingReservation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette chambre est déjà réservée pour cette période' 
      });
    }

    // Calculer le prix total
    const nombreNuits = Math.ceil((dateDepart - dateArrivee) / (1000 * 60 * 60 * 24));
    const prixParNuit = chambre.typeChambre?.prix_par_nuit || 0;
    const prixTotal = nombreNuits * prixParNuit;

    console.log('💰 Calcul du prix:', {
      nombreNuits,
      prixParNuit,
      prixTotal
    });

    // Générer numéro de réservation unique
    const numeroReservation = `RES-${Date.now().toString().slice(-8)}`;

    console.log('💾 Création de la réservation...');
    const reservation = await Reservation.create({
      hotel_id: hotelId,
      client_id: finalClientId,
      chambre_id,
      date_arrivee,
      date_depart,
      nombre_adultes: nombre_adultes || 1,
      nombre_enfants: nombre_enfants || 0,
      prix_total: prixTotal,
      statut: 'confirmee',           // Directement confirmée car créée par employé
      demandes_speciales: notes || null,  // ✅ Utiliser demandes_speciales au lieu de notes
      numero_reservation: numeroReservation,
      created_by: employee.id,
      is_verified: true,
      verified_by: employee.id,
    });

    console.log('✅ Réservation créée avec succès, ID:', reservation.id);

    // Créer une notification pour le client
    try {
      await Notification.create({
        user_id: finalClientId,
        message: `Votre réservation ${numeroReservation} a été créée et confirmée par l'hôtel.`,
        type: 'reservation_confirmed',
        reservation_id: reservation.id,
        numero_reservation: numeroReservation,
        read: false,
      });
      console.log('📧 Notification créée');
    } catch (notifError) {
      console.error('⚠️ Erreur création notification (non bloquant):', notifError.message);
    }

    // Charger la réservation complète avec les relations
    const reservationComplete = await Reservation.findOne({
      where: { id: reservation.id },
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: Chambre, as: 'chambre', attributes: ['id', 'numero_chambre', 'etage'] },
      ],
    });

    res.status(201).json({ 
      success: true, 
      message: 'Réservation créée avec succès',
      data: reservationComplete 
    });
  } catch (error) {
    console.error('❌ Erreur createReservation employee:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};