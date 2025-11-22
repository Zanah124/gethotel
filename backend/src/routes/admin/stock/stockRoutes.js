// backend/src/routes/admin/stockRoutes.js
import express from 'express';
import {
  getAllStock,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  createMouvement,
  getMouvementsByStockId,
  getLowStockAlerts,
  getStockStats,
  exportStockReport
} from '../../../controllers/stock/stockController.js';
import { auth } from '../../../middleware/auth.js';
import { roleCheck } from '../../../middleware/roleCheck.js';
import { hotelAccess } from '../../../middleware/hotelAccess.js';

const router = express.Router();

// Toutes les routes nécessitent authentification + rôle Admin
router.use(auth, roleCheck(['admin']), hotelAccess);

// Routes articles stock
router.get('/', getAllStock);
router.get('/stats', getStockStats);
router.get('/alerts', getLowStockAlerts);
router.get('/export', exportStockReport);
router.get('/:id', getStockById);
router.post('/', createStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

// Routes mouvements stock
router.post('/mouvements', createMouvement);
router.get('/:stock_id/mouvements', getMouvementsByStockId);

export default router;