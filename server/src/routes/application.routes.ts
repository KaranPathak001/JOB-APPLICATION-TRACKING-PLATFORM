import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createApplicationSchema, updateApplicationSchema } from '../validators/index.js';

const router = Router();

// Protect all application routes
router.use(authenticate);

router.get('/', ApplicationController.list);
router.post('/', validateRequest(createApplicationSchema), ApplicationController.create);
router.post('/bulk-import', ApplicationController.bulkImport);
router.get('/:id', ApplicationController.getById);
router.patch('/:id', validateRequest(updateApplicationSchema), ApplicationController.update);
router.patch('/:id/status', ApplicationController.updateStatus);
router.delete('/:id', ApplicationController.delete);

// Timeline Events
router.get('/:id/events', ApplicationController.getEvents);
router.post('/:id/events', ApplicationController.addEvent);

// Notes
router.get('/:id/notes', ApplicationController.getNotes);
router.post('/:id/notes', ApplicationController.addNote);
router.delete('/:id/notes/:noteId', ApplicationController.deleteNote);

export default router;
