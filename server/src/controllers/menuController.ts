import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menuService';

export const getCurrent = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menu = await menuService.getCurrent();
        res.json({ success: true, data: menu });
    } catch (error) { next(error); }
};

export const createOrUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menu = await menuService.createOrUpdate(req.body, req.user!._id.toString());
        res.status(201).json({ success: true, message: 'Menu saved', data: menu });
    } catch (error) { next(error); }
};

export const getByWeek = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menu = await menuService.getByWeek(req.params.date as string);
        res.json({ success: true, data: menu });
    } catch (error) { next(error); }
};
