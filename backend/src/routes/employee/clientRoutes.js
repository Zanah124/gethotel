import express from 'express';
import {
  getClients,
  getClientById,
  createClient,           // optionnel – si tu veux permettre la création directe
  // updateClient,        // optionnel
  // deleteClient,        // très sensible – souvent réservé à admin_hotel
} from '../../controllers/employee/clientController.js';

import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import { hotelAccess } from '../../middleware/hotelAccess.js';

const router = express.Router();

// Toutes les routes nécessitent authentification + rôle employee ou admin_hotel
router.use(auth, roleCheck(['employee', 'admin_hotel']), hotelAccess);

router.get('/', getClients);                // Liste des clients (avec recherche)
router.get('/:id', getClientById);          // Détail d'un client

// Optionnel – création directe d'un client depuis employé
// (souvent on préfère créer via la réservation, mais c'est utile pour certains cas)
router.post('/', createClient);

// Si tu veux activer la mise à jour (très contrôlée)
// router.patch('/:id', updateClient);

// Suppression → généralement réservé à admin_hotel ou superadmin
// router.delete('/:id', deleteClient);

export default router;