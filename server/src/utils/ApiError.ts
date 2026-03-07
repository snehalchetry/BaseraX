export class ApiError extends Error {
    statusCode: number;
    errors: Array<{ msg: string; param?: string }>;

    constructor(statusCode: number, message: string, errors: Array<{ msg: string; param?: string }> = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = 'ApiError';
    }

    static badRequest(msg: string): ApiError {
        return new ApiError(400, msg);
    }

    static unauthorized(msg: string): ApiError {
        return new ApiError(401, msg);
    }

    static forbidden(msg: string): ApiError {
        return new ApiError(403, msg);
    }

    static notFound(msg: string): ApiError {
        return new ApiError(404, msg);
    }

    static conflict(msg: string): ApiError {
        return new ApiError(409, msg);
    }

    static internal(msg: string): ApiError {
        return new ApiError(500, msg);
    }
}
