import api from './api';
import { CollectionAccount, CollectionPayment, CreateCollectionPayload, RegisterCollectionPaymentPayload, PaginatedResponse } from '@/types';

export const invoicesService = {
  getAll: async (params?: { page?: number; limit?: number; estado?: string; search?: string }): Promise<PaginatedResponse<CollectionAccount>> => {
    const { data } = await api.get<PaginatedResponse<CollectionAccount>>('/cuentas-cobro', { params });
    return data;
  },

  getById: async (id: number): Promise<CollectionAccount> => {
    const { data } = await api.get<CollectionAccount>(`/cuentas-cobro/${id}`);
    return data;
  },

  create: async (payload: CreateCollectionPayload): Promise<CollectionAccount> => {
    const { data } = await api.post<CollectionAccount>('/cuentas-cobro', payload);
    return data;
  },

  registerPayment: async (payload: RegisterCollectionPaymentPayload): Promise<CollectionPayment> => {
    const { data } = await api.post<CollectionPayment>('/cuentas-cobro/pagos', payload);
    return data;
  },

  getPayments: async (cuentaId: number): Promise<CollectionPayment[]> => {
    const { data } = await api.get<CollectionPayment[]>(`/cuentas-cobro/${cuentaId}/pagos`);
    return data;
  },

  print: async (cuentaId: number): Promise<void> => {
    await api.post(`/cuentas-cobro/${cuentaId}/imprimir`);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cuentas-cobro/${id}`);
  },
};
