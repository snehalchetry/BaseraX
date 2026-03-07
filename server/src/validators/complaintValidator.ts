import { body } from 'express-validator';

export const createComplaintRules = [
    body('category').isIn(['electrical', 'plumbing', 'furniture', 'cleaning', 'internet', 'other']).withMessage('Invalid category'),
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']),
];

export const assignComplaintRules = [
    body('assignedTo').trim().notEmpty().withMessage('Assigned to is required'),
];

export const updateStatusRules = [
    body('status').isIn(['open', 'assigned', 'in_progress', 'closed']).withMessage('Invalid status'),
    body('comment').optional().trim(),
];
