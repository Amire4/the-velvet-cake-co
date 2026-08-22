import api from './api.ts';
import { CustomCakeRequest } from '../types.ts';

function getStoredCustomCakes(): CustomCakeRequest[] {
  try {
    const raw = localStorage.getItem('velvet_custom_cakes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCake(item: CustomCakeRequest) {
  try {
    const list = getStoredCustomCakes();
    const filtered = list.filter(c => c.id !== item.id);
    filtered.unshift(item);
    localStorage.setItem('velvet_custom_cakes', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save custom cake to localStorage:', err);
  }
}

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
  try {
    const res = await api.post('/custom-cakes', data);
    if (res.data?.data) {
      saveCustomCake(res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend custom cake API unavailable, saving locally:', err);
  }

  // Base tier pricing formula
  const basePrice = (data.tiers || 1) * 85 + (data.size.includes('10') ? 25 : 0);
  const now = new Date().toISOString();

  const localReq: CustomCakeRequest = {
    id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...data,
    quotedPrice: basePrice,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now
  };

  saveCustomCake(localReq);
  return localReq;
}

export async function getCustomCakeRequestsApi(): Promise<CustomCakeRequest[]> {
  try {
    const res = await api.get('/custom-cakes');
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (err) {
    // fallback
  }
  return getStoredCustomCakes();
}

export async function getCustomCakeRequestByIdApi(id: string): Promise<CustomCakeRequest> {
  try {
    const res = await api.get(`/custom-cakes/${id}`);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    // fallback
  }

  const list = getStoredCustomCakes();
  const found = list.find(c => c.id === id);
  if (found) return found;
  throw new Error('Custom cake request not found');
}

export async function updateCustomCakeStatusApi(id: string, status: string, quotedPrice?: number): Promise<CustomCakeRequest> {
  try {
    const res = await api.put(`/custom-cakes/${id}/status`, { status, quotedPrice });
    if (res.data?.data) {
      saveCustomCake(res.data.data);
      return res.data.data;
    }
  } catch (err) {
    // fallback
  }

  const list = getStoredCustomCakes();
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      status: status as any,
      ...(quotedPrice !== undefined ? { quotedPrice } : {}),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('velvet_custom_cakes', JSON.stringify(list));
    return list[idx];
  }

  throw new Error('Custom cake request update failed');
}
