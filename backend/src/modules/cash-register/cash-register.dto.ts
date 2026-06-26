export interface OpenCashRegisterDto {
  initialAmount: number;
  notes?: string;
}

export interface CloseCashRegisterDto {
  notes?: string;
}

export interface CashRegisterResponseDto {
  id: string;
  date: Date;
  initialAmount: number;
  finalAmount?: number;
  status: string;
  openedBy: string;
  closedBy?: string;
  openedAt: Date;
  closedAt?: Date;
  notes?: string;
}

export interface CashMovementResponseDto {
  id: string;
  cashRegisterId: string;
  accountId: string;
  accountName?: string;
  amount: number;
  type: string;
  description?: string;
  reference?: string;
  paymentId?: string;
  createdAt: Date;
}

export interface CashRegisterSummaryDto {
  accountId: string;
  accountName: string;
  totalAmount: number;
  type: string;
}
