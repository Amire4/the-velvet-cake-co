import api from './api.ts';
import { Product, CakeFlavor } from '../types.ts';

export async function getProductsApi(params?: { category?: string; featured?: boolean; available?: boolean }): Promise<Product[]> {
  const res = await api.get('/products', { params });
  return res.data.data;
}

export async function getProductByIdApi(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
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
  const res = await api.get(`/products/${productId}/reviews`);
  return res.data.data;
}

export async function submitProductReviewApi(productId: string, data: { userName: string; userEmail?: string; rating: number; comment: string }) {
  const res = await api.post(`/products/${productId}/reviews`, data);
  return res.data;
}

export async function getFlavorsApi(availableOnly = false): Promise<CakeFlavor[]> {
  const res = await api.get('/flavors', { params: { available: availableOnly } });
  return res.data.data;
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
