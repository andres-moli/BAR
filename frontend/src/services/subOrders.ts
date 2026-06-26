import api from './api';
import { SubOrder, OrderItem } from '@/types';

export const subOrdersService = {
  create: async (orderId: number): Promise<SubOrder> => {
    const { data } = await api.post<SubOrder>(`/pedidos/${orderId}/sub-ordenes`);
    return data;
  },

  confirm: async (id: string): Promise<SubOrder> => {
    const { data } = await api.patch<SubOrder>(`/sub-ordenes/${id}/confirmar`);
    return data;
  },

  deliver: async (id: string): Promise<SubOrder> => {
    const { data } = await api.patch<SubOrder>(`/sub-ordenes/${id}/entregar`);
    return data;
  },

  getPending: async (): Promise<SubOrder[]> => {
    const { data } = await api.get<SubOrder[]>('/sub-ordenes/pendientes');
    return data;
  },

  getByOrder: async (orderId: number): Promise<SubOrder[]> => {
    const { data } = await api.get<SubOrder[]>(`/pedidos/${orderId}/sub-ordenes`);
    return data;
  },

  getItems: async (id: string): Promise<OrderItem[]> => {
    const { data } = await api.get<OrderItem[]>(`/sub-ordenes/${id}/items`);
    return data;
  },
};
