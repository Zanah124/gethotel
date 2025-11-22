import express from 'express';
import stockRoutes from './stockRoutes.js';
import categorieStockRoutes from './categorieStockRoutes.js';

const router = express.Router();
router.use('/stock', stockRoutes);
router.use('/categories-stock', categorieStockRoutes);

export default router;