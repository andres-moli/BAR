import api from './api';
import { DashboardStats, ReportFilters } from '@/types';

export const reportsService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/reportes/dashboard');
    return data;
  },

  getSalesReport: async (filters: ReportFilters): Promise<{ data: unknown[]; totales: Record<string, number> }> => {
    const { data } = await api.get('/reportes/ventas', { params: filters });
    return data;
  },

  getProductsReport: async (filters: ReportFilters): Promise<{ data: unknown[]; totales: Record<string, number> }> => {
    const { data } = await api.get('/reportes/productos', { params: filters });
    return data;
  },

  getPaymentMethodsReport: async (filters: ReportFilters): Promise<{ data: unknown[]; totales: Record<string, number> }> => {
    const { data } = await api.get('/reportes/metodos-pago', { params: filters });
    return data;
  },

  getCollectionReport: async (filters: ReportFilters): Promise<{ data: unknown[]; totales: Record<string, number> }> => {
    const { data } = await api.get('/reportes/cuentas-cobro', { params: filters });
    return data;
  },

  getClientsReport: async (filters: ReportFilters): Promise<{ data: unknown[]; totales: Record<string, number> }> => {
    const { data } = await api.get('/reportes/clientes', { params: filters });
    return data;
  },
};
