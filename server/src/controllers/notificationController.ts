import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await notificationService.getUserNotifications(req.user!.id, req.query as Record<string, string>);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notification = await notificationService.markAsRead(req.params.id as string, req.user!.id);
        res.json({ success: true, data: notification });
    } catch (error) { next(error); }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await notificationService.markAllAsRead(req.user!.id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};
