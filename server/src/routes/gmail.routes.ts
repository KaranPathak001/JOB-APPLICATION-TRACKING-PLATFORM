import { Router } from 'express';
import { GmailController } from '../controllers/gmail.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/connect', GmailController.getConnectUrl);
router.get('/status', GmailController.getStatus);
router.post('/sync', GmailController.sync);

export default router;
