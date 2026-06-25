export interface CreateClientDto {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
}

export interface ClientResponseDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}
