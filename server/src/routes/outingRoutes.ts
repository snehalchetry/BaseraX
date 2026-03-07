import { Router } from 'express';
import * as outingController from '../controllers/outingController';
import { createOutingRules, actionRules } from '../validators/outingValidator';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import roleGuard from '../middleware/roleGuard';

const router = Router();

router.get('/', auth, roleGuard('student', 'parent', 'warden', 'admin'), outingController.list);
router.post('/', auth, roleGuard('student'), createOutingRules, validate, outingController.create);
router.patch('/:id/parent-action', auth, roleGuard('parent'), actionRules, validate, outingController.parentAction);
router.patch('/:id/warden-action', auth, roleGuard('warden'), actionRules, validate, outingController.wardenAction);
router.get('/:id/pass', auth, roleGuard('student', 'warden'), outingController.getPass);

export default router;
