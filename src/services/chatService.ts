import api from './api';
import type { ChatMessage } from '../types';

export const chatService = {
  async createSession(): Promise<{ sessionId: string }> {
    const res = await api.post('/chat/sessions');
    return res.data;
  },

  async sendMessage(
    sessionId: string,
    message: string,
  ): Promise<{ sessionId: string; response: string }> {
    const res = await api.post(`/chat/sessions/${sessionId}/messages`, { message });
    return res.data;
  },

  async getHistory(
    sessionId: string,
  ): Promise<{ sessionId: string; messages: ChatMessage[]; createdAt: string }> {
    const res = await api.get(`/chat/sessions/${sessionId}`);
    return res.data;
  },

  async endSession(sessionId: string): Promise<void> {
    await api.delete(`/chat/sessions/${sessionId}`);
  },
};
