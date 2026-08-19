import { Router } from 'express';
import { submitContactMessage, getContactMessages, updateContactStatus } from '../controllers/contactController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', authMiddleware as any, adminMiddleware as any, getContactMessages);
router.put('/:id/status', authMiddleware as any, adminMiddleware as any, updateContactStatus);

export default router;
