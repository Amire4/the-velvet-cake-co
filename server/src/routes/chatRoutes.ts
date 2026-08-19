import { Router } from 'express';
import { handleChatMessage, getChatHistory } from '../controllers/chatController.ts';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', optionalAuthMiddleware as any, handleChatMessage as any);
router.get('/history/:sessionId', optionalAuthMiddleware as any, getChatHistory as any);

export default router;
