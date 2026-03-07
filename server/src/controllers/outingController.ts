import { Request, Response, NextFunction } from 'express';
import * as outingService from '../services/outingService';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = { ...req.body };
        // Map camelCase from frontend to snake_case
        if (data.timeFrom) { data.time_from = data.timeFrom; delete data.timeFrom; }
        if (data.timeTo) { data.time_to = data.timeTo; delete data.timeTo; }
        if (data.emergencyContact) { data.emergency_contact = data.emergencyContact; delete data.emergencyContact; }

        const outing = await outingService.createRequest(req.user!.id, data);
        res.status(201).json({ success: true, message: 'Outing request submitted', data: outing });
    } catch (error) { next(error); }
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await outingService.listRequests(req.user!, req.query as Record<string, string>);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

export const parentAction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { action, comment } = req.body;
        const outing = await outingService.parentAction(req.params.id as string, req.user!.id, action, comment);
        res.json({ success: true, message: `Request ${action}d`, data: outing });
    } catch (error) { next(error); }
};

export const wardenAction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { action, comment } = req.body;
        const outing = await outingService.wardenAction(req.params.id as string, req.user!.id, action, comment);
        res.json({ success: true, message: `Request ${action}d`, data: outing });
    } catch (error) { next(error); }
};

export const getPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const outing = await outingService.getPass(req.params.id as string);
        res.json({ success: true, data: outing });
    } catch (error) { next(error); }
};
