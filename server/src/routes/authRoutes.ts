import { Router } from 'express';
import * as authController from '../controllers/authController';
import { signupRules, loginRules, resetPasswordRules } from '../validators/authValidator';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, signupRules, validate, authController.signup);
router.post('/login', authLimiter, loginRules, validate, authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/reset-password', authLimiter, resetPasswordRules, validate, authController.resetPassword);
router.get('/profile', auth, authController.getProfile);

export default router;
