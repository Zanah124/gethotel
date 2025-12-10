import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../../controllers/admin/employeeController.js';

import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';

const router = express.Router();

// Middleware commun : authentification
router.use(auth);
router.get('/', roleCheck(['admin', 'superadmin']), getEmployees);
router.post('/', roleCheck(['admin', 'superadmin']), createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', roleCheck(['admin', 'superadmin']), updateEmployee);
router.delete('/:id', roleCheck(['admin', 'superadmin']), deleteEmployee);

export default router;