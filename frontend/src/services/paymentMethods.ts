import api from './api';
import { PaymentMethod } from '@/types';

export const paymentMethodsService = {
  getAll: async (params?: { search?: string; activo?: boolean }): Promise<PaymentMethod[]> => {
    const { data } = await api.get<PaymentMethod[]>('/metodos-pago', { params });
    return data;
  },

  getById: async (id: number): Promise<PaymentMethod> => {
    const { data } = await api.get<PaymentMethod>(`/metodos-pago/${id}`);
    return data;
  },

  create: async (pm: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentMethod> => {
    const { data } = await api.post<PaymentMethod>('/metodos-pago', pm);
    return data;
  },

  update: async (id: number, pm: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const { data } = await api.put<PaymentMethod>(`/metodos-pago/${id}`, pm);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/metodos-pago/${id}`);
  },

  getByAccount: async (accountId: number): Promise<PaymentMethod[]> => {
    const { data } = await api.get<PaymentMethod[]>(`/metodos-pago/cuenta/${accountId}`);
    return data;
  },
};
