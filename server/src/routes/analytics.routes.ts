import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/overview', AnalyticsController.getFullAnalytics);
router.get('/activity', AnalyticsController.getActivityFeed);

export default router;
