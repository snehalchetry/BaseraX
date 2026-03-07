import { Router } from 'express';
import * as menuController from '../controllers/menuController';
import { createMenuRules } from '../validators/menuValidator';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import roleGuard from '../middleware/roleGuard';

const router = Router();

router.get('/current', auth, menuController.getCurrent);
router.post('/', auth, roleGuard('admin'), createMenuRules, validate, menuController.createOrUpdate);
router.get('/week/:date', auth, menuController.getByWeek);

export default router;
