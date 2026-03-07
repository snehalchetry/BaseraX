import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'hostel-erp' },
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
            level: 'error',
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '..', '..', 'logs', 'combined.log'),
        }),
    ],
});

if (config.nodeEnv !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export default logger;
