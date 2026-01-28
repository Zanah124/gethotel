import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleCheck } from '../../middleware/roleCheck.js';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../controllers/client/notificationController.js';

const router = express.Router();

router.use(auth, roleCheck(['client']));

router.get('/', getMyNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

export default router;
