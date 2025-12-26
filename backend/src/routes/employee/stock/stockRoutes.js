import express from 'express';
import {
  getAllStock,
  getStockById,
  createMouvement,
  getMouvementsByStockId,
  getLowStockAlerts,
  createStock
} from '../../../controllers/stock/stockController.js';
import { auth } from '../../../middleware/auth.js';
import { roleCheck } from '../../../middleware/roleCheck.js';
import { hotelAccess } from '../../../middleware/hotelAccess.js';

const router = express.Router();

// Toutes les routes nécessitent authentification + rôle Employee
router.use(auth, roleCheck(['employee', 'admin']), hotelAccess);

// Routes consultation stock (lecture seule ou limitée)
router.get('/', getAllStock);
router.get('/alerts', getLowStockAlerts);
router.get('/:id', getStockById);

// Routes mouvements (entrée/sortie uniquement)
router.post('/mouvements', createMouvement);
router.get('/:stock_id/mouvements', getMouvementsByStockId);

// Routes créer un stock 
router.post('/create', createStock);

export default router;