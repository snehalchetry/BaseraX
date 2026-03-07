import { body } from 'express-validator';

export const createMenuRules = [
    body('weekStartDate').notEmpty().withMessage('Week start date is required'),
    body('days').isArray({ min: 1 }).withMessage('At least one day is required'),
    body('days.*.day').notEmpty().withMessage('Day name is required'),
    body('days.*.meals').isArray({ min: 1 }).withMessage('At least one meal is required'),
    body('days.*.meals.*.type').isIn(['breakfast', 'lunch', 'snacks', 'dinner']).withMessage('Invalid meal type'),
    body('days.*.meals.*.items').notEmpty().withMessage('Meal items are required'),
];
