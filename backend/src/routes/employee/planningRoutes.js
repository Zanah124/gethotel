import express from 'express';
import { getPlanning } from '../../controllers/admin/planningController.js';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';

const router = express.Router();

// Lecture seule : l'employé peut voir le planning de son hôtel, pas le modifier
router.get('/', auth, roleCheck(['employee']), getPlanning);

export default router;
