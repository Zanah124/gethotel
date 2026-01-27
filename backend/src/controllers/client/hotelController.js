import Hotel from '../../models/Hotel.js';
import Chambre from '../../models/Chambre.js';
import TypeChambre from '../../models/TypeChambre.js';
import Reservation from '../../models/Reservation.js';
import { Op } from 'sequelize';

// Lister les hôtels actifs (recherche publique pour les clients)
export const getHotels = async (req, res) => {
  try {
    const {
      ville,
      pays = 'Madagascar',
      nombre_etoiles,
      equipements, // ex: "wifi,piscine,parking"
      search,      // recherche par nom ou ville
      page = 1,
      limit = 12,
    } = req.query;

    const where = {
      is_active: true,
    };

    if (ville) where.ville = { [Op.like]: `%${ville}%` }; // recherche insensible à la casse
    if (pays) where.pays = { [Op.like]: `%${pays}%` };
    if (nombre_etoiles) where.nombre_etoiles = parseInt(nombre_etoiles);

    if (search) {
      where[Op.or] = [
        { nom: { [Op.like]: `%${search}%` } },
        { ville: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtre par équipements (JSON array contains)
    if (equipements) {
      const equipArray = equipements.split(',').map((e) => e.trim());
      where.equipements = { [Op.contains]: equipArray };
    }

    const hotels = await Hotel.findAndCountAll({
      where,
      attributes: [
        'id',
        'nom',
        'adresse',
        'ville',
        'pays',
        'nombre_etoiles',
        'photo_principale',
        'photos',
        'equipements',
        'services',
        'description',
      ],
      order: [['nombre_etoiles', 'DESC'], ['nom', 'ASC']],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: hotels.rows,
      pagination: {
        total: hotels.count,
        page: parseInt(page),
        pages: Math.ceil(hotels.count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Erreur getHotels client:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Voir le détail complet d'un hôtel (public, pas besoin d'être connecté)
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findOne({
      where: { id, is_active: true },
      attributes: [
        'id',
        'nom',
        'adresse',
        'ville',
        'pays',
        'code_postal',
        'telephone',
        'email',
        'description',
        'nombre_etoiles',
        'photo_principale',
        'photos',
        'equipements',
        'services',
        'politique_annulation',
      ],
      include: [
        {
          model: Chambre,
          as: 'chambres', // À ajouter dans le modèle Hotel si pas déjà fait
          attributes: ['id', 'numero_chambre', 'etage', 'statut'],
          include: [
            {
              model: TypeChambre,
              as: 'typeChambre',
              attributes: ['id', 'nom', 'prix_par_nuit', 'capacite_adultes', 'capacite_enfants', 'description'],
            },
          ],
          required: false,
        },
      ],
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé ou inactif' });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    console.error('Erreur getHotelById client:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer les chambres disponibles d'un hôtel selon dates et capacité
export const getAvailableRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const {
      date_arrivee,
      date_depart,
      nombre_adultes = 1,
      nombre_enfants = 0,
    } = req.query;

    // Validation basique des dates
    if (!date_arrivee || !date_depart) {
      return res.status(400).json({
        success: false,
        message: 'Les dates d\'arrivée et de départ sont obligatoires',
      });
    }

    const startDate = new Date(date_arrivee);
    const endDate = new Date(date_depart);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'La date de départ doit être après la date d\'arrivée',
      });
    }

    // On cherche toutes les chambres de l'hôtel
    const chambres = await Chambre.findAll({
      where: { hotel_id: hotelId },
      include: [
        {
          model: TypeChambre,
          as: 'typeChambre',
          attributes: ['id', 'nom', 'description', 'prix_par_nuit', 'capacite_adultes', 'capacite_enfants'],
        },
      ],
    });

    // On filtre manuellement celles qui sont disponibles pendant la période demandée
    // (car Sequelize ne gère pas facilement les chevauchements de dates sans sous-requête complexe)
    const availableRooms = [];

    for (const chambre of chambres) {
      // Vérifier si la chambre est déjà réservée pendant la période
      const reservationsConflit = await Reservation.count({
        where: {
          chambre_id: chambre.id,
          [Op.or]: [
            {
              date_arrivee: { [Op.lte]: endDate },
              date_depart: { [Op.gte]: startDate },
            },
          ],
          statut: { [Op.notIn]: ['annulee', 'terminee'] }, // on ignore les annulées/terminées
        },
      });

      // Si pas de conflit + capacité suffisante
      const capaciteTotale = (chambre.typeChambre?.capacite_adultes || 2) + 
                       (chambre.typeChambre?.capacite_enfants || 0);
      const personnesTotal = parseInt(nombre_adultes) + parseInt(nombre_enfants);

      if (reservationsConflit === 0 && personnesTotal <= capaciteTotale) {
        availableRooms.push(chambre);
      }
    }

    res.status(200).json({
      success: true,
      data: availableRooms,
    });
  } catch (error) {
    console.error('Erreur getAvailableRooms:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};