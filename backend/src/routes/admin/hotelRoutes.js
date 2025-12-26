import express from 'express';
import {
  getMyHotel,
  updateMyHotel,
  uploadHotelPhoto,
  uploadHotelBanner,
  getHotelStats
} from '../../controllers/admin/hotelController.js';

import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import { hotelAccess } from '../../middleware/hotelAccess.js';
import upload from '../../config/upload.js'; // multer config (voir plus bas)

const router = express.Router();

// Toutes ces routes nécessitent : auth + admin + accès à l'hôtel
router.use(auth, roleCheck(['admin']), hotelAccess);

// Récupérer les infos de mon hôtel
router.get('/', getMyHotel);

// Récupérer les statistiques de l'hôtel
router.get('/stats', getHotelStats);

// Mettre à jour les infos
router.put('/', updateMyHotel);

// Uploader un logo (optionnel)
router.post('/logo', upload.single('logo'), uploadHotelPhoto);

// Uploader une bannière (optionnel)
router.post('/banner', upload.single('banner'), uploadHotelBanner);

export default router;

