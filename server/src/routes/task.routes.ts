import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createTaskSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', TaskController.list);
router.post('/', validateRequest(createTaskSchema), TaskController.create);
router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

export default router;
