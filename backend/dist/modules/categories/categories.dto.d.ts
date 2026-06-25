export interface CreateCategoryDto {
    name: string;
    description?: string;
    icon?: string;
}
export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
}
export interface CategoryResponseDto {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=categories.dto.d.ts.map