import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import {
  getSubscriptionPlans,
  getAllSubscriptions,
  upsertHotelSubscription
} from '../../controllers/superadmin/subscriptionController.js';

const router = express.Router();

// Toutes les routes nécessitent authentification + rôle superadmin
router.use(auth, roleCheck(['superadmin']));

// Récupérer toutes les subscriptions
router.get('/', getAllSubscriptions);

// Récupérer les plans disponibles
router.get('/plans', getSubscriptionPlans);

// Créer / mettre à jour l'abonnement d'un hôtel
router.patch('/:hotelId', upsertHotelSubscription);

export default router;

