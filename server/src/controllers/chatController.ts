import { Response } from 'express';
import { db } from '../config/db.ts';
import { generateChatbotResponse } from '../services/geminiService.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export async function handleChatMessage(req: AuthRequest, res: Response) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    const activeSessionId = sessionId || `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const userId = req.user?.id;

    // Get previous chat history
    const history = await db.getChatHistory(activeSessionId);

    // Save user message
    await db.addChatMessage(activeSessionId, 'USER', message.trim(), userId);

    // Generate AI response
    const assistantReply = await generateChatbotResponse(message.trim(), history);

    // Save assistant message
    const savedAssistantMsg = await db.addChatMessage(activeSessionId, 'ASSISTANT', assistantReply, userId);

    return res.json({
      success: true,
      data: {
        sessionId: activeSessionId,
        message: savedAssistantMsg
      }
    });
  } catch (error: any) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat message.',
      data: {
        sessionId: req.body.sessionId || 'default',
        message: {
          role: 'ASSISTANT',
          message: 'Our customer support concierge is momentarily busy. Please reach out to orders@thevelvetcakeco.com or call +1 (212) 555-0187 during business hours (8am - 9pm).'
        }
      }
    });
  }
}

export async function getChatHistory(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required.'
      });
    }

    const messages = await db.getChatHistory(sessionId);
    return res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve chat history.'
    });
  }
}
