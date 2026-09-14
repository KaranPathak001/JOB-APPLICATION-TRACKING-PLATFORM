import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createInterviewSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', InterviewController.list);
router.post('/', validateRequest(createInterviewSchema), InterviewController.create);
router.patch('/:id', InterviewController.update);
router.delete('/:id', InterviewController.delete);

export default router;
