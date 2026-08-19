import { Router } from 'express';
import { createCustomCakeRequest, getCustomCakeRequests, getCustomCakeRequestById, updateCustomCakeStatus } from '../controllers/customCakeController.ts';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.post('/', optionalAuthMiddleware as any, createCustomCakeRequest as any);
router.get('/', authMiddleware as any, getCustomCakeRequests as any);
router.get('/:id', optionalAuthMiddleware as any, getCustomCakeRequestById as any);
router.put('/:id/status', authMiddleware as any, adminMiddleware as any, updateCustomCakeStatus as any);

export default router;
