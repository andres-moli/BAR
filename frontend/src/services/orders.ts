import api from './api';
import { Order, CreateOrderPayload, UpdateOrderItemPayload, PaginatedResponse } from '@/types';

export const ordersService = {
  getAll: async (params?: { page?: number; limit?: number; estado?: string; search?: string; sortBy?: string; sortOrder?: string }): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>('/pedidos', { params });
    return data;
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get<Order>(`/pedidos/${id}`);
    return data;
  },

  getByTable: async (mesaId: number): Promise<Order[]> => {
    const { data } = await api.get<Order[]>(`/pedidos/mesa/${mesaId}`);
    return data;
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post<Order>('/pedidos', payload);
    return data;
  },

  updateStatus: async (id: number, estado: Order['estado']): Promise<Order> => {
    const { data } = await api.patch<Order>(`/pedidos/${id}/estado`, { estado });
    return data;
  },

  addItem: async (orderId: number, payload: { producto_id: number; cantidad: number; notas?: string }): Promise<Order> => {
    const { data } = await api.post<Order>(`/pedidos/${orderId}/items`, payload);
    return data;
  },

  updateItem: async (orderId: number, itemId: number, payload: UpdateOrderItemPayload): Promise<Order> => {
    const { data } = await api.put<Order>(`/pedidos/${orderId}/items/${itemId}`, payload);
    return data;
  },

  removeItem: async (orderId: number, itemId: number): Promise<Order> => {
    const { data } = await api.delete<Order>(`/pedidos/${orderId}/items/${itemId}`);
    return data;
  },

  changeTable: async (orderId: number, newMesaId: number): Promise<Order> => {
    const { data } = await api.patch<Order>(`/pedidos/${orderId}/cambiar-mesa`, { mesa_id: newMesaId });
    return data;
  },

  splitOrder: async (orderId: number, items: { producto_id: number; cantidad: number }[]): Promise<Order[]> => {
    const { data } = await api.post<Order[]>(`/pedidos/${orderId}/dividir`, { items });
    return data;
  },

  cancel: async (orderId: number): Promise<Order> => {
    const { data } = await api.post<Order>(`/pedidos/${orderId}/cancelar`);
    return data;
  },

  print: async (orderId: number): Promise<void> => {
    await api.post(`/pedidos/${orderId}/imprimir`);
  },

  getPendingApproval: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/pedidos/pending-approval');
    return data;
  },
};
