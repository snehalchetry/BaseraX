import app from './app';
import { config } from './config/env';
import logger from './utils/logger';
import fs from 'fs';
import path from 'path';

// Ensure required directories exist
const dirs = ['uploads', 'logs'];
dirs.forEach((dir) => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Start server (no DB connection step needed — Supabase client is stateless)
const startServer = async (): Promise<void> => {
    try {
        app.listen(config.port, () => {
            logger.info(`🚀 Hostel ERP Server running on port ${config.port}`);
            logger.info(`📡 API: http://localhost:${config.port}/api`);
            logger.info(`💊 Health: http://localhost:${config.port}/api/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
