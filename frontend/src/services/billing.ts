import api from './api';
import { Order, Payment, PaymentPayload, ApiResponse } from '@/types';

export const billingService = {
  getOrdersForBilling: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/facturacion/pendientes');
    return data;
  },

  getOrderBillingDetail: async (orderId: number): Promise<Order> => {
    const { data } = await api.get<Order>(`/facturacion/${orderId}`);
    return data;
  },

  processPayment: async (payload: PaymentPayload): Promise<Payment> => {
    const { data } = await api.post<Payment>('/facturacion/pagar', payload);
    return data;
  },

  generateInvoice: async (orderId: number): Promise<void> => {
    const { data } = await api.post(`/facturacion/${orderId}/factura`);
    return data;
  },

  printInvoice: async (orderId: number): Promise<void> => {
    await api.post(`/facturacion/${orderId}/imprimir`);
  },

  getPaymentsByOrder: async (orderId: number): Promise<Payment[]> => {
    const { data } = await api.get<Payment[]>(`/facturacion/${orderId}/pagos`);
    return data;
  },
};
