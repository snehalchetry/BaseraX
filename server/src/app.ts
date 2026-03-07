import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { apiLimiter } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

// Route imports
import authRoutes from './routes/authRoutes';
import outingRoutes from './routes/outingRoutes';
import complaintRoutes from './routes/complaintRoutes';
import menuRoutes from './routes/menuRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://gcdnb.pbrd.co", "https://*.googleusercontent.com"],
            connectSrc: ["'self'"],
        },
    },
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL || 'https://basera-x.vercel.app'
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (uploads only) ──────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Request Logging ──────────────────────────────────────────
app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// ─── Rate Limiting ────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/outings', outingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Hostel ERP API is running', timestamp: new Date() });
});

// ─── 404 for unknown API routes ───────────────────────────────
app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;