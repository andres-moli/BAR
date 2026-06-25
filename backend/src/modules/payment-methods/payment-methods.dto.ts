export interface CreatePaymentMethodDto {
  name: string;
  accountId: string;
}

export interface UpdatePaymentMethodDto {
  name?: string;
  accountId?: string;
  isActive?: boolean;
}

export interface PaymentMethodResponseDto {
  id: string;
  name: string;
  accountId: string;
  accountName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
