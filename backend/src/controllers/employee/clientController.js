import User from '../../models/User.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

// Liste des clients avec recherche et pagination
export const getClients = async (req, res) => {
  try {
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;
    const { search, limit = 50, page = 1 } = req.query;

    const where = { role: 'client' }; // on filtre les clients

    if (hotelId) where.hotel_id = hotelId; // si tes clients sont liés à un hôtel

    if (search?.trim()) {
      where[Op.or] = [
        { nom:       { [Op.like]: `%${search.trim()}%` } },
        { prenom:    { [Op.like]: `%${search.trim()}%` } },
        { email:     { [Op.like]: `%${search.trim()}%` } },
        { telephone: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const clients = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['nom', 'ASC'], ['prenom', 'ASC']],
      attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'created_at'],
    });

    res.json({
      success: true,
      data: clients.rows,
      pagination: {
        total: clients.count,
        page: parseInt(page),
        pages: Math.ceil(clients.count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer un client par son ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;

    const where = { 
      id: id,
      role: 'client' 
    };

    if (hotelId) where.hotel_id = hotelId;

    const client = await User.findOne({
      where,
      attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'created_at'],
    });

    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client non trouvé' 
      });
    }

    res.json({ success: true, data: client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Créer un nouveau client
export const createClient = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, adresse, password } = req.body;
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;

    // Validation des champs obligatoires
    if (!nom || !prenom || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nom, prénom et email sont obligatoires' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cet email est déjà utilisé' 
      });
    }

    // Générer un mot de passe par défaut si non fourni
    const defaultPassword = password || 'Client123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Créer le client
    const client = await User.create({
      nom,
      prenom,
      email,
      telephone,
      adresse,
      password: hashedPassword,
      role: 'client',
      hotel_id: hotelId,
    });

    // Retourner le client sans le mot de passe
    const clientData = {
      id: client.id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
    };

    res.status(201).json({ 
      success: true, 
      message: 'Client créé avec succès',
      data: clientData,
      // Si mot de passe généré automatiquement, informer l'employé
      ...((!password) && { 
        info: 'Mot de passe par défaut: Client123! (à communiquer au client)' 
      })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Mettre à jour un client (optionnel)
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, telephone, adresse } = req.body;
    const employee = req.user;
    const hotelId = req.hotelId ?? employee.hotel_id;

    const where = { 
      id: id,
      role: 'client' 
    };

    if (hotelId) where.hotel_id = hotelId;

    const client = await User.findOne({ where });

    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client non trouvé' 
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== client.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet email est déjà utilisé par un autre utilisateur' 
        });
      }
    }

    // Mettre à jour les champs
    await client.update({
      nom: nom ?? client.nom,
      prenom: prenom ?? client.prenom,
      email: email ?? client.email,
      telephone: telephone ?? client.telephone,
      adresse: adresse ?? client.adresse,
    });

    res.json({ 
      success: true, 
      message: 'Client mis à jour avec succès',
      data: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};