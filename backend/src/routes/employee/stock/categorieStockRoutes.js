import express from 'express';
import { getAllCategories, 
    createCategorie,
    updateCategorie,
    deleteCategorie
} from '../../../controllers/stock/CategorieStockController.js';
import { auth } from '../../../middleware/auth.js';
import { roleCheck } from '../../../middleware/roleCheck.js';
import { hotelAccess } from '../../../middleware/hotelAccess.js';

const router = express.Router();
router.use(auth, roleCheck(['employee']), hotelAccess);


router.get('/', getAllCategories);
router.post('/', createCategorie);
router.put('/:id', updateCategorie);
router.delete('/:id', deleteCategorie);

export default router;