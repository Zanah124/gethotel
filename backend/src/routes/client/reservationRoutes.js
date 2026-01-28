import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import {
  createReservation,
  getMyReservations,
  getMyReservationById,
  cancelMyReservation,
} from '../../controllers/client/reservationController.js';

const router = express.Router();

router.use(auth, roleCheck(['client']));

router.get('/', getMyReservations);
router.get('/:id', getMyReservationById);
router.post('/create', createReservation);
router.put('/:id/cancel', cancelMyReservation);

export default router;
