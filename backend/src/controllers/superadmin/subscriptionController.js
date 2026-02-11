import Hotel from '../../models/Hotel.js';
import Subscription from '../../models/Subscription.js';
import SubscriptionPlan from '../../models/SubscriptionPlan.js';

const ALLOWED_STATUSES = [
  'active',
  'canceled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired'
];

// Récupérer tous les plans d'abonnement disponibles
export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      where: { is_active: true },
      order: [['price_monthly', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des plans',
      error: error.message
    });
  }
};

// Récupérer toutes les subscriptions avec détails hôtel et plan
export const getAllSubscriptions = async (req, res) => {
  try {
    const { status, hotel_id, plan_id, page = 1, limit = 50 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (hotel_id) where.hotel_id = hotel_id;
    if (plan_id) where.plan_id = plan_id;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where,
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['id', 'nom', 'ville', 'email', 'telephone']
        },
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'price_monthly', 'price_yearly', 'max_rooms', 'max_employees']
        }
      ],
      order: [['current_period_end', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    return res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des abonnements',
      error: error.message
    });
  }
};

// Créer ou mettre à jour l'abonnement d'un hôtel
export const upsertHotelSubscription = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const {
      plan_id,
      status,
      current_period_start,
      current_period_end,
      trial_end
    } = req.body;

    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: 'plan_id est obligatoire'
      });
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hôtel non trouvé'
      });
    }

    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan d’abonnement introuvable'
      });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut d’abonnement invalide'
      });
    }

    // Valeurs par défaut
    const now = new Date();
    const defaultPeriodEnd = new Date(now);
    defaultPeriodEnd.setDate(defaultPeriodEnd.getDate() + 30);

    const payload = {
      hotel_id: hotel.id,
      plan_id,
      status: status || 'active',
      current_period_start: current_period_start || now,
      current_period_end: current_period_end || defaultPeriodEnd,
      trial_end: trial_end || null
    };

    let subscription = await Subscription.findOne({
      where: { hotel_id: hotel.id }
    });

    if (subscription) {
      await subscription.update(payload);
    } else {
      subscription = await Subscription.create(payload);
    }

    const subscriptionWithRelations = await Subscription.findByPk(subscription.id, {
      include: [
        { model: SubscriptionPlan, as: 'plan' },
        { model: Hotel, as: 'hotel' }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Abonnement mis à jour avec succès',
      data: subscriptionWithRelations
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’abonnement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l’abonnement',
      error: error.message
    });
  }
};

