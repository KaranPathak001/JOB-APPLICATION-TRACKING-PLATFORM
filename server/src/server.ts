import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { SeederService } from './services/seeder.service.js';
import { AuthService } from './services/auth.service.js';
import { sendSuccess } from './utils/response.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import taskRoutes from './routes/task.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import gmailRoutes from './routes/gmail.routes.js';

const app = express();

// Security & middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting for auth and API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JobFlow AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// Demo seed & instant login endpoint
app.post('/api/demo/seed', async (req, res, next) => {
  try {
    const seedResult = await SeederService.seedDemoUser();
    const loginResult = await AuthService.login('alex.chen@jobflow.ai', 'DemoPass123!');
    return sendSuccess(res, loginResult, 'Demo environment ready');
  } catch (error) {
    next(error);
  }
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gmail', gmailRoutes);

// Error Handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  // Auto-seed demo account in development
  try {
    await SeederService.seedDemoUser();
  } catch (e) {
    // Ignore if offline
  }

  app.listen(config.port, () => {
    console.log(`🚀 [JobFlow AI] Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();

export default app;
