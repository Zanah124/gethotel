import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import { getAllUsers } from '../../controllers/superadmin/userController.js';

const router = express.Router();

router.use(auth, roleCheck(['superadmin']));

router.get('/', getAllUsers);

export default router;
