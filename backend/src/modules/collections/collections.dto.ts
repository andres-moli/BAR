export interface CreateCollectionDto {
  clientId: string;
  totalAmount: number;
  notes?: string;
  dueDate?: string;
}

export interface RegisterPaymentDto {
  amount: number;
  paymentMethodId: string;
  reference?: string;
}

export interface CollectionResponseDto {
  id: string;
  clientId: string;
  clientName?: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  notes?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  payments?: any[];
}
