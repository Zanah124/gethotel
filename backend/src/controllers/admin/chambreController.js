import Chambre from '../../models/Chambre.js';
import TypeChambre from '../../models/TypeChambre.js';

// Ajouter une chambre (Admin)
export const addChambre = async (req, res) => {
  try {
    const { numero_chambre, etage, type_chambre_id, notes } = req.body;
    const hotel_id = req.user.hotel_id; // Défini par middleware hotelAccess

    if (!numero_chambre || !type_chambre_id) {
      return res.status(400).json({ message: 'Numéro et type de chambre sont requis' });
    }

    // Vérifier que le type de chambre appartient bien à l'hôtel
    const typeChambre = await TypeChambre.findOne({
      where: { id: type_chambre_id, hotel_id },
    });

    if (!typeChambre) {
      return res.status(404).json({ message: 'Type de chambre non trouvé ou non autorisé pour cet hôtel' });
    }

    const chambre = await Chambre.create({
      hotel_id,
      type_chambre_id,
      numero_chambre,
      etage,
      notes,
      statut: 'disponible',
    });

    res.status(201).json({
      message: 'Chambre ajoutée avec succès',
      chambre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de la chambre' });
  }
};

// Lister toutes les chambres de l'hôtel
export const getAllChambres = async (req, res) => {
  try {
    const hotel_id = req.user.hotel_id;

    const chambres = await Chambre.findAll({
      where: { hotel_id },
      include: [
        {
          model: TypeChambre,
          as: 'typeChambre',
          attributes: ['nom', 'prix_par_nuit', 'capacite', 'description'],
        },
      ],
      order: [['etage', 'ASC'], ['numero_chambre', 'ASC']],
    });

    res.json(chambres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une chambre par ID
export const getChambreById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel_id = req.user.hotel_id;

    const chambre = await Chambre.findOne({
      where: { id, hotel_id },
      include: [{
        model: TypeChambre,
        as: 'typeChambre',
        attributes: { exclude: ['photos'] },
      }],
    });

    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    res.json(chambre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier une chambre (Admin)
export const updateChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_chambre, etage, type_chambre_id, statut, notes } = req.body;
    const hotel_id = req.user.hotel_id;

    const chambre = await Chambre.findOne({ where: { id, hotel_id } });

    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    if (type_chambre_id) {
      const typeChambre = await TypeChambre.findOne({
        where: { id: type_chambre_id, hotel_id },
      });
      if (!typeChambre) {
        return res.status(400).json({ message: 'Type de chambre invalide pour cet hôtel' });
      }
    }

    await chambre.update({
      numero_chambre: numero_chambre ?? chambre.numero_chambre,
      etage: etage ?? chambre.etage,
      type_chambre_id: type_chambre_id ?? chambre.type_chambre_id,
      statut: statut ?? chambre.statut,
      notes: notes ?? chambre.notes,
    });

    res.json({ message: 'Chambre mise à jour avec succès', chambre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une chambre (Admin)
export const deleteChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel_id = req.user.hotel_id;

    const chambre = await Chambre.findOne({ where: { id, hotel_id } });

    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    await chambre.destroy();

    res.json({ message: 'Chambre supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Nouveau : Permettre à l'employé de changer le statut d'une chambre
export const updateChambreStatutByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const hotel_id = req.user.hotel_id;

    // Liste des statuts qu'un employé peut définir
    const statutsAutorisésPourEmploye = ['disponible', 'nettoyage', 'maintenance', 'occupee'];
    
    if (!statut || !statutsAutorisésPourEmploye.includes(statut)) {
      return res.status(400).json({ 
        message: 'Statut invalide ou non autorisé pour un employé' 
      });
    }

    const chambre = await Chambre.findOne({ where: { id, hotel_id } });

    if (!chambre) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Optionnel : empêcher de marquer comme "occupée" (généralement géré par réception ou check-in)
    if (statut === 'occupee') {
      return res.status(403).json({ 
        message: 'Les employés ne peuvent pas marquer une chambre comme occupée' 
      });
    }

    await chambre.update({ statut });

    // Récupérer la chambre mise à jour avec le type
    // Exclure 'photos' si la colonne n'existe pas encore (migration non exécutée)
    const chambreMiseAJour = await Chambre.findOne({
      where: { id },
      include: [{
        model: TypeChambre,
        as: 'typeChambre',
        attributes: { exclude: ['photos'] },
      }],
    });

    res.json({ 
      message: 'Statut de la chambre mis à jour avec succès', 
      chambre: chambreMiseAJour 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

