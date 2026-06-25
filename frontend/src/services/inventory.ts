import api from './api';
import { Product, PaginatedResponse } from '@/types';

export interface Movement {
  id: string;
  tipo: string;
  cantidad: number;
  descripcion: string;
  producto_id: string;
  product: Product;
  usuario_id: string;
  user: { id: string; nombre: string };
  created_at: string;
}

export interface CreateMovementPayload {
  productId: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantity: number;
  description?: string;
}

export const inventoryService = {
  getAll: async (params?: { search?: string; bajoStock?: boolean; categoria_id?: string }): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/inventario', { params });
    return data;
  },

  getProductStock: async (productId: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/inventario/${productId}`);
    return data;
  },

  getMovements: async (productId: string): Promise<Movement[]> => {
    const { data } = await api.get<Movement[]>(`/inventario/${productId}/movimientos`);
    return data;
  },

  createMovement: async (payload: CreateMovementPayload): Promise<Movement> => {
    const { data } = await api.post<Movement>('/inventario/movimientos', payload);
    return data;
  },

  adjustStock: async (productId: string, payload: { quantity: number; description?: string }): Promise<Product> => {
    const { data } = await api.patch<Product>(`/inventario/${productId}/ajustar`, payload);
    return data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/inventario/bajo-stock');
    return data;
  },
};
