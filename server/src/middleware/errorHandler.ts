import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';

const errorHandler = (err: Error | ApiError, req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal server error';

    if (statusCode >= 500) {
        logger.error(`${statusCode} - ${message}`, { url: req.originalUrl, method: req.method, stack: err.stack });
    } else {
        logger.warn(`${statusCode} - ${message}`, { url: req.originalUrl, method: req.method });
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...((err instanceof ApiError && err.errors.length > 0) && { errors: err.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
