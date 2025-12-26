// backend/src/routes/admin/typeChambreRoutes.js
import express from 'express';
import {
  addTypeChambre,
  getAllTypesChambre,
  getTypeChambreById,
  updateTypeChambre,
  deleteTypeChambre,
} from '../../controllers/admin/typeChambreController.js';
import {auth} from '../../middleware/auth.js';
import {roleCheck} from '../../middleware/roleCheck.js';
import {hotelAccess} from '../../middleware/hotelAccess.js';
const router = express.Router();

router.use(auth);
router.use(hotelAccess);

router.post('/', roleCheck(['Admin']), addTypeChambre);
router.get('/', roleCheck(['Admin', 'Employee']), getAllTypesChambre);
router.get('/:id', roleCheck(['Admin', 'Employee']), getTypeChambreById);
router.put('/:id', roleCheck(['Admin']), updateTypeChambre);
router.delete('/:id', roleCheck(['Admin']), deleteTypeChambre);

export default router;