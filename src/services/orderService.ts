import api from './api.ts';
import { Order } from '../types.ts';

export async function createOrderApi(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  preferredDate: string;
  customerNotes?: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number; customization?: string }>;
}): Promise<Order> {
  const res = await api.post('/orders', orderData);
  return res.data.data;
}

export async function getOrdersApi(): Promise<Order[]> {
  const res = await api.get('/orders');
  return res.data.data;
}

export async function getOrderByIdApi(id: string): Promise<Order> {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
}

export async function lookupOrdersApi(query: string): Promise<Order[]> {
  const res = await api.get('/orders/lookup', { params: { query } });
  return res.data.data;
}

export async function updateOrderStatusApi(id: string, orderStatus: string, paymentStatus?: string): Promise<Order> {
  const res = await api.put(`/orders/${id}/status`, { orderStatus, paymentStatus });
  return res.data.data;
}
