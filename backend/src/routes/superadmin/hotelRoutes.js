import express from 'express';
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deactivateHotel,
  activateHotel,
  deleteHotel
} from '../../controllers/superadmin/hotelController.js';

import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';

const router = express.Router();

// Toutes ces routes nécessitent : auth + superadmin
router.use(auth, roleCheck(['superadmin']));

// CRUD des hôtels
router.get('/', getAllHotels);                    // GET /api/superadmin/hotels
router.get('/:id', getHotelById);                 // GET /api/superadmin/hotels/:id
router.post('/', createHotel);                    // POST /api/superadmin/hotels
router.put('/:id', updateHotel);                  // PUT /api/superadmin/hotels/:id
router.patch('/:id/deactivate', deactivateHotel); // PATCH /api/superadmin/hotels/:id/deactivate
router.patch('/:id/activate', activateHotel);     // PATCH /api/superadmin/hotels/:id/activate
router.delete('/:id', deleteHotel);               // DELETE /api/superadmin/hotels/:id

export default router;