import TypeChambre from '../../models/TypeChambre.js';

// Ajouter un type de chambre
export const addTypeChambre = async (req, res) => {
  try {
    const { nom, description, prix_par_nuit, capacite } = req.body;
    const hotel_id = req.user.hotel_id;

    if (!nom || !prix_par_nuit || !capacite) {
      return res.status(400).json({
        message: 'Nom, prix par nuit et capacité sont requis'
      });
    }

    const typeChambre = await TypeChambre.create({
      hotel_id,
      nom,
      description,
      prix_par_nuit,
      capacite,
    });

    res.status(201).json({
      message: 'Type de chambre ajouté avec succès',
      typeChambre
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister tous les types de chambre de l'hôtel
export const getAllTypesChambre = async (req, res) => {
  try {
    const hotel_id = req.user.hotel_id;

    const types = await TypeChambre.findAll({
      where: { hotel_id },
      order: [['nom', 'ASC']],
    });

    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir un type par ID
export const getTypeChambreById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel_id = req.user.hotel_id;

    const type = await TypeChambre.findOne({
      where: { id, hotel_id },
    });

    if (!type) {
      return res.status(404).json({ message: 'Type de chambre non trouvé' });
    }

    res.json(type);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier un type
export const updateTypeChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix_par_nuit, capacite } = req.body;
    const hotel_id = req.user.hotel_id;

    const type = await TypeChambre.findOne({ where: { id, hotel_id } });

    if (!type) {
      return res.status(404).json({ message: 'Type de chambre non trouvé' });
    }

    await type.update({
      nom: nom ?? type.nom,
      description: description ?? type.description,
      prix_par_nuit: prix_par_nuit ?? type.prix_par_nuit,
      capacite: capacite ?? type.capacite,
    });

    res.json({
      message: 'Type de chambre mis à jour',
      type
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un type (attention : si des chambres l'utilisent, Sequelize bloquera si contrainte FK)
export const deleteTypeChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel_id = req.user.hotel_id;

    const type = await TypeChambre.findOne({ where: { id, hotel_id } });

    if (!type) {
      return res.status(404).json({ message: 'Type de chambre non trouvé' });
    }

    await type.destroy();

    res.json({ message: 'Type de chambre supprimé avec succès' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Impossible de supprimer : des chambres utilisent ce type'
      });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// uploadPhotosTypeChambre
export const uploadPhotosTypeChambre = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel_id = req.user.hotel_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const type = await TypeChambre.findOne({ where: { id, hotel_id } });
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    const newPhotos = req.files.map(file => `/uploads/types_chambre/${file.filename}`);

    // Ajouter aux photos existantes ou remplacer
    type.photos = [...(type.photos || []), ...newPhotos];
    await type.save();

    res.json({ message: 'Photos ajoutées', photos: type.photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};