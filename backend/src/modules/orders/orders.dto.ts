export interface CreateOrderDto {
  tableId?: string;
  clientId?: string;
  notes?: string;
  userId?: string;
}

export interface AddItemDto {
  productId: string;
  quantity: number;
  notes?: string;
  userId?: string;
}

export interface UpdateItemDto {
  quantity?: number;
  notes?: string;
}

export interface ChangeTableDto {
  tableId: string;
}

export interface SplitOrderDto {
  items: { itemId: string; quantity: number }[];
  tableId?: string;
}

export interface OrderResponseDto {
  id: string;
  status: string;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  tableId: string | null;
  table?: { id: string; number: number };
  userId: string;
  user?: { id: string; name: string };
  clientId: string | null;
  client?: { id: string; name: string };
  items: any[];
  payments: any[];
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
}
