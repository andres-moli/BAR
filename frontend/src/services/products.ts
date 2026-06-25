import api from './api';
import { Product, PaginatedResponse } from '@/types';

export const productsService = {
  getAll: async (params?: { page?: number; limit?: number; categoria_id?: number; search?: string; activo?: boolean }): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/productos', { params });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/productos/${id}`);
    return data;
  },

  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const { data } = await api.post<Product>('/productos', product);
    return data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<Product>(`/productos/${id}`, product);
    return data;
  },

  toggleActive: async (id: number): Promise<Product> => {
    const { data } = await api.patch<Product>(`/productos/${id}/toggle`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },
};
