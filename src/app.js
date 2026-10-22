import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
app.use(express.json({ limit: '10kb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'API is healthy', data: { status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
