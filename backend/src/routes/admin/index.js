import express from 'express';
import hotelRoutes from './hotelRoutes.js';
import categorieStockRoutes from './stock/categorieStockRoutes.js';
import stockRoutes from './stock/stockRoutes.js';



const router = express.Router();
router.use('/stock', stockRoutes);
router.use('/categories-stock', categorieStockRoutes);
router.use('/hotel', hotelRoutes);


export default router;