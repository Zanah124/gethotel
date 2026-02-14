import Chambre from '../../models/Chambre.js';
import TypeChambre from '../../models/TypeChambre.js';
import Reservation from '../../models/Reservation.js';
import { Op } from 'sequelize';

// Récupérer toutes les chambres de l'hôtel
export const getChambres = async (req, res) => {
  try {
    const hotelId = req.hotelId ?? req.user.hotel_id;

    const chambres = await Chambre.findAll({
      where: { hotel_id: hotelId },
      include: [
        { 
          model: TypeChambre, 
          as: 'typeChambre', 
          attributes: ['nom', 'prix_par_nuit', 'description'] 
        },
      ],
      order: [['numero_chambre', 'ASC']],
    });

    res.json({ success: true, data: chambres });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer une chambre par son ID
export const getChambreById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.hotelId ?? req.user.hotel_id;

    const chambre = await Chambre.findOne({
      where: { 
        id: id,
        hotel_id: hotelId 
      },
      include: [
        { 
          model: TypeChambre, 
          as: 'type_chambre', 
          attributes: ['nom', 'prix_par_nuit', 'description', 'capacite'] 
        },
      ],
    });

    if (!chambre) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chambre non trouvée' 
      });
    }

    res.json({ success: true, data: chambre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer les chambres disponibles pour une période donnée
export const getAvailableChambres = async (req, res) => {
    try {
      const { date_debut, date_fin } = req.query;
      const hotelId = req.hotelId ?? req.user.hotel_id;
  
      if (!date_debut || !date_fin) {
        return res.status(400).json({ success: false, message: 'Dates requises' });
      }
  
      // Logique de disponibilité (exemple simplifié – à améliorer)
      const occupied = await Reservation.findAll({
        where: {
          hotel_id: hotelId,
          statut: { [Op.in]: ['confirmee', 'check_in'] },
          [Op.or]: [
            {
              date_arrivee: { [Op.lte]: date_fin },
              date_depart:   { [Op.gte]: date_debut },
            },
          ],
        },
        attributes: ['chambre_id'],
      });
  
      const occupiedIds = occupied.map(r => r.chambre_id);
  
      const chambres = await Chambre.findAll({
        where: {
          hotel_id: hotelId,
          id: { [Op.notIn]: occupiedIds },
          statut: { [Op.notIn]: ['maintenance', 'hors_service'] }, // selon tes statuts
        },
        include: [
          { model: TypeChambre, as: 'typeChambre', attributes: ['nom', 'prix_par_nuit'] },
        ],
        order: [['numero_chambre', 'ASC']],
      });
  
      res.json({ success: true, data: chambres });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };