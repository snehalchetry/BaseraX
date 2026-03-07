import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, notificationController.getNotifications);
router.patch('/read-all', auth, notificationController.markAllAsRead);
router.patch('/:id/read', auth, notificationController.markAsRead);

export default router;
