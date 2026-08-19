import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, lookupOrders } from '../controllers/orderController.ts';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.get('/lookup', lookupOrders as any);
router.post('/', optionalAuthMiddleware as any, createOrder as any);
router.get('/', authMiddleware as any, getOrders as any);
router.get('/:id', optionalAuthMiddleware as any, getOrderById as any);
router.put('/:id/status', authMiddleware as any, adminMiddleware as any, updateOrderStatus as any);

export default router;

