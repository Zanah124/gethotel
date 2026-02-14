import express from 'express';
import { getPlanning, savePlanning } from '../../controllers/admin/planningController.js';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';

const router = express.Router();

router.use(auth);
router.get('/', roleCheck(['admin', 'superadmin']), getPlanning);
router.put('/', roleCheck(['admin', 'superadmin']), savePlanning);

export default router;
