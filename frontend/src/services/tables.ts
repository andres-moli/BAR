import api from './api';
import { Table, ApiResponse } from '@/types';

export const tablesService = {
  getAll: async (): Promise<Table[]> => {
    const { data } = await api.get<Table[]>('/mesas');
    return data;
  },

  getById: async (id: number): Promise<Table> => {
    const { data } = await api.get<Table>(`/mesas/${id}`);
    return data;
  },

  create: async (table: Omit<Table, 'id' | 'created_at' | 'updated_at'>): Promise<Table> => {
    const { data } = await api.post<Table>('/mesas', table);
    return data;
  },

  update: async (id: number, table: Partial<Table>): Promise<Table> => {
    const { data } = await api.put<Table>(`/mesas/${id}`, table);
    return data;
  },

  updateStatus: async (id: number, estado: Table['estado']): Promise<Table> => {
    const { data } = await api.patch<Table>(`/mesas/${id}/estado`, { estado });
    return data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete<ApiResponse<void>>(`/mesas/${id}`);
    return data;
  },
};
