import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { adminMiddleware } from '../middleware/adminMiddleware.ts';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware as any, adminMiddleware as any, createProduct);
router.put('/:id', authMiddleware as any, adminMiddleware as any, updateProduct);
router.delete('/:id', authMiddleware as any, adminMiddleware as any, deleteProduct);

export default router;
