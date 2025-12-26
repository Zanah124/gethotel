import express from 'express';
import categorieStockRoutes from './categorieStockRoutes.js';
import stockRoutes from './stockRoutes.js';

const router = express.Router();
router.use('/categories', categorieStockRoutes);
router.use('/', stockRoutes);

export default router;