import api from './api';
import { User, PaginatedResponse } from '@/types';

export const usersService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get<PaginatedResponse<User>>('/usuarios', { params });
    return data;
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/usuarios/${id}`);
    return data;
  },

  create: async (user: Omit<User, 'id' | 'updated_at' | 'created_at' | 'ultimo_acceso'>): Promise<User> => {
    const { data } = await api.post<User>('/usuarios', user);
    return data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>(`/usuarios/${id}`, user);
    return data;
  },

  toggleActive: async (id: number): Promise<User> => {
    const { data } = await api.patch<User>(`/usuarios/${id}/toggle`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
