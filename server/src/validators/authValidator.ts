import { body } from 'express-validator';

export const signupRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'parent', 'warden', 'admin']).withMessage('Invalid role'),
    body('rollNumber').optional().trim(),
];

export const loginRules = [
    body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const resetPasswordRules = [
    body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
