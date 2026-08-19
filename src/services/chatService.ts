import api from './api.ts';
import { ChatMessage } from '../types.ts';

export async function sendChatMessageApi(message: string, sessionId: string): Promise<{ sessionId: string; message: ChatMessage }> {
  const res = await api.post('/chat', { message, sessionId });
  return res.data.data;
}

export async function getChatHistoryApi(sessionId: string): Promise<ChatMessage[]> {
  const res = await api.get(`/chat/history/${sessionId}`);
  return res.data.data;
}
