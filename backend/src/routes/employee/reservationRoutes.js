import express from 'express';
import {
  getReservations,
  getReservationById,
  confirmReservation,
  checkIn,
  checkOut,
  cancelReservation,
} from '../../controllers/employee/reservationController.js';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import { hotelAccess } from '../../middleware/hotelAccess.js';


const router = express.Router();

// Toutes les routes protégées pour employé
router.use(auth, roleCheck(['Employee']), hotelAccess);

router.get('/', getReservations);
router.get('/:id', getReservationById);
router.patch('/:id/confirm', confirmReservation);
router.patch('/:id/checkin', checkIn);
router.patch('/:id/checkout', checkOut);
router.patch('/:id/cancel', cancelReservation);

export default router;