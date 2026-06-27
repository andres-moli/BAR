import api from './api';
import { Combo, ApiResponse } from '@/types';

export const combosService = {
  getAll: async (): Promise<Combo[]> => {
    const { data } = await api.get<Combo[]>('/combos');
    return data;
  },

  getActive: async (): Promise<Combo[]> => {
    const { data } = await api.get<Combo[]>('/combos/activos');
    return data;
  },

  getById: async (id: string): Promise<Combo> => {
    const { data } = await api.get<Combo>(`/combos/${id}`);
    return data;
  },

  create: async (payload: any): Promise<Combo> => {
    const { data } = await api.post<Combo>('/combos', payload);
    return data;
  },

  update: async (id: string, payload: any): Promise<Combo> => {
    const { data } = await api.put<Combo>(`/combos/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/combos/${id}`);
  },
};
