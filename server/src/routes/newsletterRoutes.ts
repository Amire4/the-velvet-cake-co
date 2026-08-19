import { Router } from 'express';
import { subscribeNewsletter, getNewsletterSubscribers } from '../controllers/newsletterController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.post('/', subscribeNewsletter);
router.get('/', authMiddleware as any, adminMiddleware as any, getNewsletterSubscribers);

export default router;
