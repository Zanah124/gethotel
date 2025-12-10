import Hotel from '../../models/Hotel.js';
import User from '../../models/User.js';
import Subscription from '../../models/Subscription.js';
import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import { Op } from 'sequelize';

/**
 * Récupérer tous les hôtels (SUPERADMIN uniquement)
 */
export const getAllHotels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { nom: { [Op.like]: `%${search}%` } },
            { ville: { [Op.like]: `%${search}%` } },
            { pays: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows: hotels } = await Hotel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Subscription,
          as: 'subscription',
          include: [
            {
              model: SubscriptionPlan,
              as: 'plan'
            }
          ]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: hotels,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Récupérer un hôtel par ID (SUPERADMIN)
 */
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id, {
      include: [
        {
          model: Subscription,
          as: 'subscription',
          include: [
            {
              model: SubscriptionPlan,
              as: 'plan'
            }
          ]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'statut']
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Créer un nouvel hôtel (SUPERADMIN uniquement)
 */
export const createHotel = async (req, res) => {
  try {
    const {
      nom,
      adresse,
      ville,
      pays,
      code_postal,
      telephone,
      email,
      description,
      nombre_etoiles,
      equipements,
      services,
      politique_annulation,
      admin_email,
      admin_nom,
      admin_prenom,
      admin_telephone,
      admin_password,
      plan_id
    } = req.body;

    // Validation
    if (!nom || !adresse || !ville || !admin_email || !admin_password) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants (nom, adresse, ville, admin_email, admin_password)'
      });
    }

    // Vérifier si l'email admin existe déjà
    const existingUser = await User.findOne({ where: { email: admin_email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer l'hôtel
    const hotel = await Hotel.create({
      nom,
      adresse,
      ville,
      pays: pays || 'Madagascar',
      code_postal,
      telephone,
      email,
      description,
      nombre_etoiles,
      equipements: equipements || [],
      services: services || [],
      politique_annulation,
      is_active: true
    });

    // ✅ Créer l'utilisateur admin de l'hôtel
    // Le mot de passe est passé EN CLAIR - le hook beforeCreate dans User.js le hachera automatiquement
    const adminUser = await User.create({
      nom: admin_nom,
      prenom: admin_prenom,
      email: admin_email,
      telephone: admin_telephone,
      password: admin_password, // ✅ EN CLAIR - sera haché par le hook
      role: 'admin',
      hotel_id: hotel.id,
      statut: 'actif'
    });

    // Mettre à jour l'hôtel avec l'admin_hotel_id
    await hotel.update({ admin_hotel_id: adminUser.id });

    // Créer l'abonnement si plan_id est fourni
    if (plan_id) {
      const plan = await SubscriptionPlan.findByPk(plan_id);
      if (plan) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 jours d'essai

        await Subscription.create({
          hotel_id: hotel.id,
          plan_id: plan_id,
          status: 'trialing',
          trial_end: trialEndDate,
          current_period_start: new Date(),
          current_period_end: trialEndDate
        });
      }
    }

    // Récupérer l'hôtel avec toutes les relations
    const hotelWithRelations = await Hotel.findByPk(hotel.id, {
      include: [
        {
          model: Subscription,
          as: 'subscription',
          include: [{ model: SubscriptionPlan, as: 'plan' }]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Hôtel créé avec succès',
      data: hotelWithRelations
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un hôtel (SUPERADMIN)
 */
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    // Ne pas permettre la mise à jour de admin_hotel_id directement
    delete updateData.admin_hotel_id;

    await hotel.update(updateData);

    // Récupérer l'hôtel mis à jour avec les relations
    const updatedHotel = await Hotel.findByPk(id, {
      include: [
        {
          model: Subscription,
          as: 'subscription',
          include: [{ model: SubscriptionPlan, as: 'plan' }]
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Hôtel mis à jour avec succès',
      data: updatedHotel
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Désactiver un hôtel (SUPERADMIN)
 */
export const deactivateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    await hotel.update({ is_active: false });

    res.status(200).json({
      success: true,
      message: 'Hôtel désactivé avec succès',
      data: hotel
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Activer un hôtel (SUPERADMIN)
 */
export const activateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    await hotel.update({ is_active: true });

    res.status(200).json({
      success: true,
      message: 'Hôtel activé avec succès',
      data: hotel
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Supprimer un hôtel (SUPERADMIN - DANGER)
 */
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    await hotel.destroy();

    res.status(200).json({
      success: true,
      message: 'Hôtel supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'hôtel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};