import api from './api';
import { Category } from '@/types';

export const categoriesService = {
  getAll: async (params?: { search?: string; activo?: boolean }): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categorias', { params });
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get<Category>(`/categorias/${id}`);
    return data;
  },

  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const { data } = await api.post<Category>('/categorias', category);
    return data;
  },

  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await api.put<Category>(`/categorias/${id}`, category);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
