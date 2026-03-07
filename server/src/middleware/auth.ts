import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';

interface JwtPayload {
    id: string;
}

const auth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

        const user = await User.findById(decoded.id);
        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(ApiError.unauthorized('Invalid token'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(ApiError.unauthorized('Token expired'));
        }
        next(error);
    }
};

export default auth;
