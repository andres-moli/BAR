import api from './api';
import { Client, CollectionAccount, Order, PaginatedResponse } from '@/types';

export const clientsService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Client>> => {
    const { data } = await api.get<PaginatedResponse<Client>>('/clientes', { params });
    return data;
  },

  getById: async (id: number): Promise<Client> => {
    const { data } = await api.get<Client>(`/clientes/${id}`);
    return data;
  },

  create: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    const { data } = await api.post<Client>('/clientes', client);
    return data;
  },

  update: async (id: number, client: Partial<Client>): Promise<Client> => {
    const { data } = await api.put<Client>(`/clientes/${id}`, client);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  getOrders: async (id: number): Promise<Order[]> => {
    const { data } = await api.get<Order[]>(`/clientes/${id}/pedidos`);
    return data;
  },

  getCollectionAccounts: async (id: number): Promise<CollectionAccount[]> => {
    const { data } = await api.get<CollectionAccount[]>(`/clientes/${id}/cuentas-cobro`);
    return data;
  },
};
