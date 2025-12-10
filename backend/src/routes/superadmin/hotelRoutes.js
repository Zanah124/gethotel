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
router.get('/', getAllHotels);                    
router.get('/:id', getHotelById);                 
router.post('/', createHotel);                   
router.put('/:id', updateHotel);                
router.patch('/:id/deactivate', deactivateHotel); 
router.patch('/:id/activate', activateHotel);    
router.delete('/:id', deleteHotel);              

export default router;