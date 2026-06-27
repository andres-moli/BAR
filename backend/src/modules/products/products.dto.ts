export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId: string;
  stock?: number;
  imageUrl?: string;
  showInMenu?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  categoryId?: string;
  isActive?: boolean;
  stock?: number;
  imageUrl?: string;
  showInMenu?: boolean;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  categoryId: string;
  category?: { id: string; name: string };
  isActive: boolean;
  showInMenu: boolean;
  stock: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
