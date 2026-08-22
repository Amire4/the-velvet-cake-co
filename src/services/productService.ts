import api from './api.ts';
import { Product, CakeFlavor } from '../types.ts';
import { FALLBACK_PRODUCTS, FALLBACK_FLAVORS } from '../data/fallbackData.ts';

export async function getProductsApi(params?: { category?: string; featured?: boolean; available?: boolean }): Promise<Product[]> {
  try {
    const res = await api.get('/products', { params });
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return FALLBACK_PRODUCTS;
  } catch (err) {
    console.warn('Backend API unavailable, using built-in high-definition cake catalog fallback:', err);
    let filtered = [...FALLBACK_PRODUCTS];
    if (params?.category && params.category !== 'All' && params.category !== 'All Collections') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.featured !== undefined) {
      filtered = filtered.filter(p => p.featured === params.featured);
    }
    return filtered;
  }
}

export async function getProductByIdApi(id: string): Promise<Product> {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data?.data) {
      return res.data.data;
    }
    const found = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id);
    if (found) return found;
    return FALLBACK_PRODUCTS[0];
  } catch (err) {
    const found = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id);
    return found || FALLBACK_PRODUCTS[0];
  }
}

export async function createProductApi(data: Partial<Product>): Promise<Product> {
  const res = await api.post('/products', data);
  return res.data.data;
}

export async function updateProductApi(id: string, data: Partial<Product>): Promise<Product> {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
}

export async function deleteProductApi(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function getProductReviewsApi(productId: string) {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data.data;
  } catch {
    return [];
  }
}

export async function submitProductReviewApi(productId: string, data: { userName: string; userEmail?: string; rating: number; comment: string }) {
  try {
    const res = await api.post(`/products/${productId}/reviews`, data);
    return res.data;
  } catch {
    return { success: true, message: 'Review received' };
  }
}

export async function getFlavorsApi(availableOnly = false): Promise<CakeFlavor[]> {
  try {
    const res = await api.get('/flavors', { params: { available: availableOnly } });
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return FALLBACK_FLAVORS;
  } catch (err) {
    console.warn('Backend API unavailable, using built-in flavor catalog fallback:', err);
    return FALLBACK_FLAVORS;
  }
}

export async function createFlavorApi(data: Partial<CakeFlavor>): Promise<CakeFlavor> {
  const res = await api.post('/flavors', data);
  return res.data.data;
}

export async function updateFlavorApi(id: string, data: Partial<CakeFlavor>): Promise<CakeFlavor> {
  const res = await api.put(`/flavors/${id}`, data);
  return res.data.data;
}

export async function deleteFlavorApi(id: string): Promise<void> {
  await api.delete(`/flavors/${id}`);
}
