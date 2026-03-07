import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json({
            success: true, message: 'User registered successfully',
            data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
        });
    } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { rollNumber, password } = req.body;
        const result = await authService.login(rollNumber, password);
        res.json({
            success: true, message: 'Login successful',
            data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
        });
    } catch (error) { next(error); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshAccessToken(refreshToken);
        res.json({ success: true, data: tokens });
    } catch (error) { next(error); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { rollNumber, newPassword } = req.body;
        const result = await authService.resetPassword(rollNumber, newPassword);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    res.json({ success: true, data: { user: req.user } });
};
