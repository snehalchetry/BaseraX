import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

const validate = (req: Request, _res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted = errors.array().map((e) => ({ msg: e.msg, param: 'path' in e ? e.path : undefined }));
        return next(new ApiError(422, 'Validation failed', formatted));
    }
    next();
};

export default validate;
