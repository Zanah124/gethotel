import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './admin/stock/index.js';
import employeeRoutes from './admin/employeeRoutes.js';
import clientHotelRoutes from './client/hotelRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
// backend/src/routes/index.js (section client à ajouter)
router.use('/admin', adminRoutes);
router.use('/admin/employee', employeeRoutes);

// Import des routes client
const clientChambreRoutes = require('./client/chambreRoutes');
const clientReservationRoutes = require('./client/reservationRoutes');
const clientPaiementRoutes = require('./client/paiementRoutes');
const clientProfileRoutes = require('./client/profileRoutes');

// Routes client
router.use('/client/hotels', clientHotelRoutes);
router.use('/client/chambres', clientChambreRoutes);
router.use('/client/reservations', clientReservationRoutes);
router.use('/client/paiements', clientPaiementRoutes);
router.use('/client/profile', clientProfileRoutes);

module.exports = router;

export default router;
