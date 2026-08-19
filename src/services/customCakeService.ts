import api from './api.ts';
import { CustomCakeRequest } from '../types.ts';

export async function createCustomCakeRequestApi(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cakeType: string;
  size: string;
  shape: string;
  tiers: number;
  flavor: string;
  filling: string;
  frosting: string;
  colors: string;
  theme?: string;
  message?: string;
  dietaryRequirement?: string;
  eventDate: string;
  referenceImageUrl?: string;
  additionalNotes?: string;
}): Promise<CustomCakeRequest> {
  const res = await api.post('/custom-cakes', data);
  return res.data.data;
}

export async function getCustomCakeRequestsApi(): Promise<CustomCakeRequest[]> {
  const res = await api.get('/custom-cakes');
  return res.data.data;
}

export async function getCustomCakeRequestByIdApi(id: string): Promise<CustomCakeRequest> {
  const res = await api.get(`/custom-cakes/${id}`);
  return res.data.data;
}

export async function updateCustomCakeStatusApi(id: string, status: string, quotedPrice?: number): Promise<CustomCakeRequest> {
  const res = await api.put(`/custom-cakes/${id}/status`, { status, quotedPrice });
  return res.data.data;
}
