import api from './api.ts';
import { ChatMessage } from '../types.ts';
import { getSmartBakeryResponse } from './smartChatEngine.ts';

export async function sendChatMessageApi(
  message: string,
  sessionId: string,
  history: ChatMessage[] = []
): Promise<{ sessionId: string; message: ChatMessage }> {
  try {
    const res = await api.post('/chat', { message, sessionId });
    if (res.data?.data?.message) {
      return res.data.data;
    }
    throw new Error('Invalid backend response');
  } catch (err) {
    console.warn('Backend chat API offline or unreachable, using local AI engine:', err);
    // Intelligent contextual NLP response fallback
    const replyText = getSmartBakeryResponse(message, history);
    return {
      sessionId,
      message: {
        role: 'ASSISTANT',
        message: replyText,
        createdAt: new Date().toISOString()
      }
    };
  }
}

export async function getChatHistoryApi(sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await api.get(`/chat/history/${sessionId}`);
    return res.data?.data || [];
  } catch {
    return [];
  }
}

