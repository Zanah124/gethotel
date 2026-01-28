import express from 'express';
import hotelRoutes from './hotelRoutes.js';
import userRoutes from './userRoutes.js';
// import subscriptionRoutes from './subscriptionRoutes.js';

const router = express.Router();

router.use('/hotels', hotelRoutes);
router.use('/users', userRoutes);
// router.use('/subscriptions', subscriptionRoutes);

export default router;