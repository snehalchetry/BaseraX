import { body } from 'express-validator';

export const createOutingRules = [
    body('date').notEmpty().withMessage('Date is required'),
    body('timeFrom').notEmpty().withMessage('Start time is required'),
    body('timeTo').notEmpty().withMessage('End time is required'),
    body('purpose').trim().notEmpty().withMessage('Purpose is required').isLength({ max: 500 }),
    body('destination').trim().notEmpty().withMessage('Destination is required').isLength({ max: 200 }),
    body('emergencyContact').optional().matches(/^\d{10}$/),
];

export const actionRules = [
    body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
    body('comment').optional().trim(),
];
