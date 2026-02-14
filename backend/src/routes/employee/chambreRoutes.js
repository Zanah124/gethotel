import express from 'express';
import {
  getChambres,
  getChambreById,
  getAvailableChambres,       // le plus important pour la création de réservation
  // createChambre,           // réservé admin_hotel
  // updateChambre,
  // changeStatus, etc.
} from '../../controllers/employee/chambreController.js';

import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import { hotelAccess } from '../../middleware/hotelAccess.js';

const router = express.Router();

router.use(auth, roleCheck(['employee', 'admin_hotel']), hotelAccess);
router.get('/available', getAvailableChambres);
router.get('/', getChambres);                     // Liste complète (filtre possible)
router.get('/:id', getChambreById);               // Détail d'une chambre

// Les routes de modification sont généralement pour admin_hotel uniquement
// router.post('/', roleCheck('admin_hotel'), createChambre);
// router.patch('/:id', roleCheck('admin_hotel'), updateChambre);
// router.patch('/:id/status', roleCheck('admin_hotel'), changeChambreStatus);

export default router;