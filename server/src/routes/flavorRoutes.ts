import { Router } from 'express';
import { getFlavors, createFlavor, updateFlavor, deleteFlavor } from '../controllers/flavorController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.get('/', getFlavors);
router.post('/', authMiddleware as any, adminMiddleware as any, createFlavor);
router.put('/:id', authMiddleware as any, adminMiddleware as any, updateFlavor);
router.delete('/:id', authMiddleware as any, adminMiddleware as any, deleteFlavor);

export default router;
