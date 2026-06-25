import { UserRole, TableStatus, OrderStatus, CollectionStatus, AccountType } from '../value-objects/index';
export interface UserEntity {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface SafeUserEntity {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface TableEntity {
    id: string;
    number: number;
    status: TableStatus;
    capacity: number;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CategoryEntity {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductEntity {
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
    category?: CategoryEntity;
}
export interface OrderEntity {
    id: string;
    status: OrderStatus;
    notes: string | null;
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    tableId: string | null;
    userId: string;
    clientId: string | null;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
}
export interface OrderItemEntity {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes: string | null;
    orderId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AccountEntity {
    id: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaymentMethodEntity {
    id: string;
    name: string;
    accountId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaymentEntity {
    id: string;
    amount: number;
    paymentMethodId: string;
    reference: string | null;
    orderId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod?: PaymentMethodEntity;
}
export interface InvoiceEntity {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    nit: string | null;
    name: string | null;
    email: string | null;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ClientEntity {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    document: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CollectionAccountEntity {
    id: string;
    totalAmount: number;
    paidAmount: number;
    status: CollectionStatus;
    notes: string | null;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | null;
}
export interface CollectionPaymentEntity {
    id: string;
    amount: number;
    paymentMethodId: string;
    reference: string | null;
    collectionAccountId: string;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod?: PaymentMethodEntity;
}
export interface MovementEntity {
    id: string;
    type: string;
    quantity: number;
    description: string | null;
    productId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface OrderProductEntity {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CashRegisterEntity {
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
export interface CashMovementEntity {
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
export type Entity = UserEntity | TableEntity | ProductEntity | OrderEntity | OrderItemEntity | PaymentEntity | InvoiceEntity | ClientEntity | CollectionAccountEntity | CollectionPaymentEntity | MovementEntity | OrderProductEntity | CategoryEntity | AccountEntity | PaymentMethodEntity | CashRegisterEntity | CashMovementEntity;
//# sourceMappingURL=index.d.ts.map