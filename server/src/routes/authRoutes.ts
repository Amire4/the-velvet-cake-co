import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware as any, getMe as any);
router.put('/profile', authMiddleware as any, updateProfile as any);

export default router;
