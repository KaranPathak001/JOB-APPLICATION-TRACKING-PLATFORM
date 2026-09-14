import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { parseJobSchema, assistantQuerySchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.post('/parse-job', validateRequest(parseJobSchema), AIController.parseJob);
router.post('/assistant', validateRequest(assistantQuerySchema), AIController.assistant);

export default router;
