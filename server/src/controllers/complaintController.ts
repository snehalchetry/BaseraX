import { Request, Response, NextFunction } from 'express';
import * as complaintService from '../services/complaintService';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = { ...req.body };
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            data.images = (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`);
        }
        if (!data.room_number && !data.roomNumber) data.room_number = req.user!.room_number;
        if (!data.block) data.block = req.user!.block;
        // Map camelCase from frontend to snake_case
        if (data.roomNumber) { data.room_number = data.roomNumber; delete data.roomNumber; }

        const complaint = await complaintService.createComplaint(req.user!.id, data);
        res.status(201).json({ success: true, message: 'Complaint filed', data: complaint });
    } catch (error) { next(error); }
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await complaintService.listComplaints(req.user!, req.query as Record<string, string>);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

export const assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const complaint = await complaintService.assignComplaint(req.params.id as string, req.user!.id, req.body.assignedTo);
        res.json({ success: true, message: 'Complaint assigned', data: complaint });
    } catch (error) { next(error); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const complaint = await complaintService.updateStatus(req.params.id as string, req.user!.id, req.body.status, req.body.comment);
        res.json({ success: true, message: 'Status updated', data: complaint });
    } catch (error) { next(error); }
};
