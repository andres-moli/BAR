export interface CreateAccountDto {
  name: string;
  type?: 'CASH' | 'BANK' | 'DIGITAL_WALLET' | 'OTHER';
}

export interface UpdateAccountDto {
  name?: string;
  type?: 'CASH' | 'BANK' | 'DIGITAL_WALLET' | 'OTHER';
  isActive?: boolean;
}

export interface AccountResponseDto {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
