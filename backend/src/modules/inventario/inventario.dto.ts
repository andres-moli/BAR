export interface CreateMovementDto {
  productId: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantity: number;
  description?: string;
}

export interface AdjustStockDto {
  quantity: number;
  description?: string;
}

export interface StockFilterDto {
  bajoStock?: boolean;
  search?: string;
  categoria_id?: string;
}
