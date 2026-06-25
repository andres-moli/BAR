import api from './api';
import { Account } from '@/types';

export const accountsService = {
  getAll: async (params?: { search?: string; activo?: boolean }): Promise<Account[]> => {
    const { data } = await api.get<Account[]>('/cuentas', { params });
    return data;
  },

  getById: async (id: number): Promise<Account> => {
    const { data } = await api.get<Account>(`/cuentas/${id}`);
    return data;
  },

  create: async (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<Account> => {
    const { data } = await api.post<Account>('/cuentas', account);
    return data;
  },

  update: async (id: number, account: Partial<Account>): Promise<Account> => {
    const { data } = await api.put<Account>(`/cuentas/${id}`, account);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/cuentas/${id}`);
  },
};
