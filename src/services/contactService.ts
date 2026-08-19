import api from './api.ts';
import { ContactMessage, AdminStats } from '../types.ts';

export async function submitContactApi(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<ContactMessage> {
  const res = await api.post('/contact', data);
  return res.data.data;
}

export async function getContactMessagesApi(): Promise<ContactMessage[]> {
  const res = await api.get('/contact');
  return res.data.data;
}

export async function updateContactStatusApi(id: string, status: string): Promise<ContactMessage> {
  const res = await api.put(`/contact/${id}/status`, { status });
  return res.data.data;
}

export async function subscribeNewsletterApi(email: string): Promise<any> {
  const res = await api.post('/newsletter', { email });
  return res.data;
}

export async function getAdminStatsApi(): Promise<AdminStats> {
  const res = await api.get('/admin/stats');
  return res.data.data;
}

export async function getCustomersApi(): Promise<any[]> {
  const res = await api.get('/admin/customers');
  return res.data.data;
}
