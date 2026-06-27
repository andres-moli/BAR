import api from './api';
import { CashRegister, CashMovement, CashRegisterSummary, WaiterReport } from '@/types';

export const cashRegisterService = {
  getCurrent: async (): Promise<CashRegister | null> => {
    const { data } = await api.get<CashRegister | null>('/caja/actual');
    return data;
  },

  open: async (payload: { initialAmount: number; notes?: string }): Promise<CashRegister> => {
    const { data } = await api.post<CashRegister>('/caja/abrir', payload);
    return data;
  },

  close: async (payload: { notes?: string }): Promise<CashRegister> => {
    const { data } = await api.post<CashRegister>('/caja/cerrar', payload);
    return data;
  },

  getMovements: async (cashRegisterId: number): Promise<CashMovement[]> => {
    const { data } = await api.get<CashMovement[]>(`/caja/${cashRegisterId}/movimientos`);
    return data;
  },

  getSummary: async (cashRegisterId: number): Promise<CashRegisterSummary[]> => {
    const { data } = await api.get<CashRegisterSummary[]>(`/caja/${cashRegisterId}/resumen`);
    return data;
  },

  getHistory: async (params?: { page?: number; limit?: number }): Promise<{ data: CashRegister[]; total: number }> => {
    const res = await api.get<{ registers: CashRegister[]; total: number }>('/caja/historial', { params });
    return { data: res.data.registers || [], total: res.data.total || 0 };
  },

  getWaiterReport: async (cashRegisterId: number): Promise<{ waiters: WaiterReport[] }> => {
    const { data } = await api.get(`/caja/${cashRegisterId}/reporte-meseros`);
    return data;
  },
};
