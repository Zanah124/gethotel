import express from 'express';
import {
  addChambre,
  getAllChambres,
  getChambreById,
  updateChambre,
  deleteChambre,
  updateChambreStatutByEmployee
} from '../../controllers/admin/chambreController.js';
import {auth} from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import {hotelAccess} from '../../middleware/hotelAccess.js';

const router = express.Router();

router.use(auth);
router.use(hotelAccess);

router.post('/', roleCheck(['Admin']), addChambre);
router.get('/', roleCheck(['Admin', 'Employee']), getAllChambres);
router.get('/:id', roleCheck(['Admin', 'Employee']), getChambreById);
router.put('/:id', roleCheck(['Admin']), updateChambre);
router.delete('/:id', roleCheck(['Admin']), deleteChambre);
router.patch('/:id/statut', auth, roleCheck(['Employee']), hotelAccess, updateChambreStatutByEmployee);

export default router;