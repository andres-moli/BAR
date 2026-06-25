import { z } from 'zod';
import { UserRole, TableStatus, OrderStatus, CollectionStatus, AccountType } from '../../domain/value-objects/index';
export declare const LoginDTO: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginDTOType = z.infer<typeof LoginDTO>;
export declare const RegisterDTO: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: UserRole;
    password: string;
}, {
    email: string;
    name: string;
    password: string;
    role?: UserRole | undefined;
}>;
export type RegisterDTOType = z.infer<typeof RegisterDTO>;
export interface AuthResponseDTO {
    user: UserResponseDTO;
    token: string;
}
export declare const CreateTableDTO: z.ZodObject<{
    number: z.ZodNumber;
    capacity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    capacity: number;
    location?: string | undefined;
}, {
    number: number;
    capacity?: number | undefined;
    location?: string | undefined;
}>;
export type CreateTableDTOType = z.infer<typeof CreateTableDTO>;
export declare const UpdateTableDTO: z.ZodObject<{
    number: z.ZodOptional<z.ZodNumber>;
    capacity: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof TableStatus>>;
}, "strip", z.ZodTypeAny, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
    status?: TableStatus | undefined;
}, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
    status?: TableStatus | undefined;
}>;
export type UpdateTableDTOType = z.infer<typeof UpdateTableDTO>;
export interface TableResponseDTO {
    id: string;
    number: number;
    status: TableStatus;
    capacity: number;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateCategoryDTO: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
}>;
export type CreateCategoryDTOType = z.infer<typeof CreateCategoryDTO>;
export declare const UpdateCategoryDTO: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}>;
export type UpdateCategoryDTOType = z.infer<typeof UpdateCategoryDTO>;
export interface CategoryResponseDTO {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateAccountDTO: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof AccountType>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: AccountType;
}, {
    name: string;
    type?: AccountType | undefined;
}>;
export type CreateAccountDTOType = z.infer<typeof CreateAccountDTO>;
export declare const UpdateAccountDTO: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof AccountType>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    type?: AccountType | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    type?: AccountType | undefined;
}>;
export type UpdateAccountDTOType = z.infer<typeof UpdateAccountDTO>;
export interface AccountResponseDTO {
    id: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreatePaymentMethodDTO: z.ZodObject<{
    name: z.ZodString;
    accountId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    accountId: string;
}, {
    name: string;
    accountId: string;
}>;
export type CreatePaymentMethodDTOType = z.infer<typeof CreatePaymentMethodDTO>;
export declare const UpdatePaymentMethodDTO: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    accountId?: string | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    accountId?: string | undefined;
}>;
export type UpdatePaymentMethodDTOType = z.infer<typeof UpdatePaymentMethodDTO>;
export interface PaymentMethodResponseDTO {
    id: string;
    name: string;
    accountId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateProductDTO: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    cost: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodString;
    stock: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    categoryId: string;
    stock: number;
    description?: string | undefined;
    cost?: number | undefined;
    imageUrl?: string | null | undefined;
}, {
    name: string;
    price: number;
    categoryId: string;
    description?: string | undefined;
    cost?: number | undefined;
    stock?: number | undefined;
    imageUrl?: string | null | undefined;
}>;
export type CreateProductDTOType = z.infer<typeof CreateProductDTO>;
export declare const UpdateProductDTO: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    cost: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    categoryId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    stock: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
    cost?: number | null | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | null | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
    cost?: number | null | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | null | undefined;
}>;
export type UpdateProductDTOType = z.infer<typeof UpdateProductDTO>;
export interface ProductResponseDTO {
    id: string;
    name: string;
    description: string | null;
    price: number;
    cost: number | null;
    categoryId: string;
    isActive: boolean;
    stock: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateOrderDTO: z.ZodObject<{
    tableId: z.ZodOptional<z.ZodString>;
    clientId: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    notes?: string | undefined;
    tableId?: string | undefined;
    clientId?: string | undefined;
}, {
    userId: string;
    notes?: string | undefined;
    tableId?: string | undefined;
    clientId?: string | undefined;
}>;
export type CreateOrderDTOType = z.infer<typeof CreateOrderDTO>;
export declare const AddItemDTO: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    productId: string;
    notes?: string | undefined;
}, {
    quantity: number;
    productId: string;
    notes?: string | undefined;
}>;
export type AddItemDTOType = z.infer<typeof AddItemDTO>;
export declare const UpdateItemDTO: z.ZodObject<{
    quantity: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    notes?: string | null | undefined;
    quantity?: number | undefined;
}, {
    notes?: string | null | undefined;
    quantity?: number | undefined;
}>;
export type UpdateItemDTOType = z.infer<typeof UpdateItemDTO>;
export interface OrderItemResponseDTO {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes: string | null;
    productId: string;
    productName: string;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface OrderResponseDTO {
    id: string;
    status: OrderStatus;
    notes: string | null;
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    tableId: string | null;
    tableNumber?: number | null;
    userId: string;
    userName?: string;
    clientId: string | null;
    clientName?: string | null;
    items: OrderItemResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
}
export declare const ProcessPaymentDTO: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    orderId: string;
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}, {
    userId: string;
    orderId: string;
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}>;
export type ProcessPaymentDTOType = z.infer<typeof ProcessPaymentDTO>;
export interface PaymentResponseDTO {
    id: string;
    amount: number;
    paymentMethodId: string;
    reference: string | null;
    orderId: string;
    userId: string;
    userName?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateClientDTO: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    document: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    document?: string | null | undefined;
    address?: string | null | undefined;
}, {
    name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    document?: string | null | undefined;
    address?: string | null | undefined;
}>;
export type CreateClientDTOType = z.infer<typeof CreateClientDTO>;
export declare const UpdateClientDTO: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    document: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | null | undefined;
    name?: string | undefined;
    phone?: string | null | undefined;
    document?: string | null | undefined;
    address?: string | null | undefined;
}, {
    email?: string | null | undefined;
    name?: string | undefined;
    phone?: string | null | undefined;
    document?: string | null | undefined;
    address?: string | null | undefined;
}>;
export type UpdateClientDTOType = z.infer<typeof UpdateClientDTO>;
export interface ClientResponseDTO {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    document: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CreateCollectionAccountDTO: z.ZodObject<{
    totalAmount: z.ZodNumber;
    clientId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clientId: string;
    totalAmount: number;
    notes?: string | undefined;
    dueDate?: string | undefined;
}, {
    clientId: string;
    totalAmount: number;
    notes?: string | undefined;
    dueDate?: string | undefined;
}>;
export type CreateCollectionAccountDTOType = z.infer<typeof CreateCollectionAccountDTO>;
export declare const RegisterPaymentDTO: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}, {
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}>;
export type RegisterPaymentDTOType = z.infer<typeof RegisterPaymentDTO>;
export interface CollectionPaymentResponseDTO {
    id: string;
    amount: number;
    paymentMethodId: string;
    reference: string | null;
    collectionAccountId: string;
    createdAt: Date;
}
export interface CollectionResponseDTO {
    id: string;
    totalAmount: number;
    paidAmount: number;
    status: CollectionStatus;
    notes: string | null;
    clientId: string;
    clientName?: string;
    payments: CollectionPaymentResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | null;
}
export declare const CreateUserDTO: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: UserRole;
    password: string;
}, {
    email: string;
    name: string;
    role: UserRole;
    password: string;
}>;
export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;
export declare const UpdateUserDTO: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    password?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    password?: string | undefined;
}>;
export type UpdateUserDTOType = z.infer<typeof UpdateUserDTO>;
export interface UserResponseDTO {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReportFilterDTO: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    categoryId?: string | undefined;
    userId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    paymentMethodId?: string | undefined;
}, {
    categoryId?: string | undefined;
    userId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    paymentMethodId?: string | undefined;
}>;
export type ReportFilterDTOType = z.infer<typeof ReportFilterDTO>;
export interface SalesReportItemDTO {
    date: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
}
export interface SalesReportDTO {
    totalRevenue: number;
    totalOrders: number;
    totalTax: number;
    totalDiscount: number;
    averageOrderValue: number;
    salesByCategory: {
        categoryId: string;
        categoryName: string;
        total: number;
        count: number;
    }[];
    salesByPaymentMethod: {
        paymentMethodId: string;
        paymentMethodName: string;
        total: number;
        count: number;
    }[];
    topProducts: {
        productId: string;
        productName: string;
        quantity: number;
        total: number;
    }[];
    dailySales: SalesReportItemDTO[];
    generatedAt: Date;
    filters: ReportFilterDTOType;
}
export declare const OpenCashRegisterDTO: z.ZodObject<{
    initialAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    initialAmount: number;
    notes?: string | undefined;
}, {
    initialAmount: number;
    notes?: string | undefined;
}>;
export type OpenCashRegisterDTOType = z.infer<typeof OpenCashRegisterDTO>;
export declare const CloseCashRegisterDTO: z.ZodObject<{
    finalAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    finalAmount: number;
    notes?: string | undefined;
}, {
    finalAmount: number;
    notes?: string | undefined;
}>;
export type CloseCashRegisterDTOType = z.infer<typeof CloseCashRegisterDTO>;
export interface CashRegisterResponseDTO {
    id: string;
    date: Date;
    initialAmount: number;
    finalAmount: number | null;
    status: string;
    openedBy: string;
    closedBy: string | null;
    openedAt: Date;
    closedAt: Date | null;
    notes: string | null;
}
export interface CashMovementResponseDTO {
    id: string;
    cashRegisterId: string;
    accountId: string;
    amount: number;
    type: string;
    description: string | null;
    reference: string | null;
    paymentId: string | null;
    createdAt: Date;
}
export interface CashRegisterSummaryDTO {
    cashRegisterId: string;
    date: Date;
    initialAmount: number;
    finalAmount: number | null;
    status: string;
    totalIncome: number;
    totalOutcome: number;
    movementsByAccount: {
        accountId: string;
        accountName: string;
        totalAmount: number;
        movements: CashMovementResponseDTO[];
    }[];
}
//# sourceMappingURL=index.d.ts.map