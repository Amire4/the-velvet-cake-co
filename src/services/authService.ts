import api from './api.ts';
import { User } from '../types.ts';

export async function loginApi(email: string, password: string):Promise<{ token: string; user: User }> {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data;
}

export async function registerApi(data: { name: string; email: string; password: string; phone?: string }): Promise<{ token: string; user: User }> {
  const res = await api.post('/auth/register', data);
  return res.data.data;
}

export async function getMeApi(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data.data;
}

export async function updateProfileApi(data: { name?: string; phone?: string }): Promise<User> {
  const res = await api.put('/auth/profile', data);
  return res.data.data;
}
