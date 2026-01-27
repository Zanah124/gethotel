import express from 'express';
import { getHotels, getHotelById, getAvailableRooms } from '../../controllers/client/hotelController.js';

const router = express.Router();


router.get('/', getHotels);                    // Recherche / liste hôtels
router.get('/:id', getHotelById);              // Détail hôtel + chambres/types
router.get('/:hotelId/rooms', getAvailableRooms); // Chambres disponibles d'un hôtel

export default router;