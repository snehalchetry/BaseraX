import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types';

const roleGuard = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized`));
        }
        next();
    };
};

export default roleGuard;
