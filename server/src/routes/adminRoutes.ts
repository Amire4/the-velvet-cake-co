import { Router } from 'express';
import { getAdminOverview, getCustomers } from '../controllers/adminController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.use(authMiddleware as any);
router.use(adminMiddleware as any);

router.get('/stats', getAdminOverview);
router.get('/customers', getCustomers);

export default router;
