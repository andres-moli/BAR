import { UserEntity, SafeUserEntity, TableEntity, ProductEntity, OrderEntity, OrderItemEntity, PaymentEntity, ClientEntity, CollectionAccountEntity, CollectionPaymentEntity, CategoryEntity, AccountEntity, PaymentMethodEntity, CashRegisterEntity, CashMovementEntity } from '../entities/index';
import { TableStatus, OrderStatus } from '../value-objects/index';
export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<UserEntity>;
    update(id: string, data: Partial<{
        email: string;
        name: string;
        role: string;
        isActive: boolean;
    }>): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}
export interface ITableRepository {
    findAll(): Promise<TableEntity[]>;
    findById(id: string): Promise<TableEntity | null>;
    findByNumber(number: number): Promise<TableEntity | null>;
    findByStatus(status: TableStatus): Promise<TableEntity[]>;
    create(data: {
        number: number;
        capacity?: number;
        location?: string;
    }): Promise<TableEntity>;
    update(id: string, data: Partial<{
        number: number;
        capacity: number;
        location: string;
        status: TableStatus;
    }>): Promise<TableEntity>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: TableStatus): Promise<TableEntity>;
}
export interface IProductRepository {
    findAll(includeInactive?: boolean): Promise<ProductEntity[]>;
    findById(id: string): Promise<ProductEntity | null>;
    findByCategory(categoryId: string): Promise<ProductEntity[]>;
    create(data: {
        name: string;
        description?: string;
        price: number;
        cost?: number;
        categoryId: string;
        stock?: number;
        imageUrl?: string;
    }): Promise<ProductEntity>;
    update(id: string, data: Partial<{
        name: string;
        description: string;
        price: number;
        cost: number;
        categoryId: string;
        isActive: boolean;
        stock: number;
        imageUrl: string;
    }>): Promise<ProductEntity>;
    delete(id: string): Promise<void>;
}
export interface IOrderRepository {
    findAll(filters?: {
        status?: OrderStatus;
        tableId?: string;
        userId?: string;
        clientId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<OrderEntity[]>;
    findById(id: string): Promise<OrderEntity | null>;
    findByIdWithItems(id: string): Promise<(OrderEntity & {
        items: (OrderItemEntity & {
            product: ProductEntity;
        })[];
        table: TableEntity | null;
        user: SafeUserEntity;
        client: ClientEntity | null;
    }) | null>;
    findByTable(tableId: string, status?: OrderStatus): Promise<OrderEntity[]>;
    findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<OrderEntity[]>;
    findByClient(clientId: string): Promise<OrderEntity[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<OrderEntity[]>;
    create(data: {
        tableId?: string;
        userId: string;
        clientId?: string;
        notes?: string;
    }): Promise<OrderEntity>;
    update(id: string, data: Partial<{
        status: OrderStatus;
        notes: string;
        subtotal: number;
        tax: number;
        total: number;
        discount: number;
        tableId: string;
        clientId: string;
        closedAt: Date;
    }>): Promise<OrderEntity>;
    delete(id: string): Promise<void>;
    addItem(data: {
        orderId: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        notes?: string;
    }): Promise<OrderItemEntity>;
    updateItem(id: string, data: Partial<{
        quantity: number;
        unitPrice: number;
        subtotal: number;
        notes: string;
    }>): Promise<OrderItemEntity>;
    removeItem(id: string): Promise<void>;
    findOrderItem(id: string): Promise<(OrderItemEntity & {
        product: ProductEntity;
    }) | null>;
    getHistory(orderId: string): Promise<OrderEntity[]>;
}
export interface IPaymentRepository {
    findAll(filters?: {
        paymentMethodId?: string;
        startDate?: Date;
        endDate?: Date;
        userId?: string;
    }): Promise<PaymentEntity[]>;
    findById(id: string): Promise<PaymentEntity | null>;
    findByOrder(orderId: string): Promise<PaymentEntity[]>;
    create(data: {
        amount: number;
        paymentMethodId: string;
        reference?: string;
        orderId: string;
        userId: string;
    }): Promise<PaymentEntity>;
    findByDateRange(startDate: Date, endDate: Date): Promise<PaymentEntity[]>;
}
export interface IClientRepository {
    findAll(): Promise<ClientEntity[]>;
    findById(id: string): Promise<ClientEntity | null>;
    findByDocument(document: string): Promise<ClientEntity | null>;
    findByEmail(email: string): Promise<ClientEntity | null>;
    create(data: {
        name: string;
        email?: string;
        phone?: string;
        document?: string;
        address?: string;
    }): Promise<ClientEntity>;
    update(id: string, data: Partial<{
        name: string;
        email: string;
        phone: string;
        document: string;
        address: string;
    }>): Promise<ClientEntity>;
    delete(id: string): Promise<void>;
    getHistory(clientId: string): Promise<OrderEntity[]>;
}
export interface ICollectionAccountRepository {
    findAll(filters?: {
        status?: string;
        clientId?: string;
    }): Promise<CollectionAccountEntity[]>;
    findById(id: string): Promise<(CollectionAccountEntity & {
        client: ClientEntity;
        payments: CollectionPaymentEntity[];
    }) | null>;
    findByClient(clientId: string): Promise<CollectionAccountEntity[]>;
    create(data: {
        totalAmount: number;
        clientId: string;
        notes?: string;
        dueDate?: Date;
    }): Promise<CollectionAccountEntity>;
    update(id: string, data: Partial<{
        totalAmount: number;
        paidAmount: number;
        status: string;
        notes: string;
    }>): Promise<CollectionAccountEntity>;
    delete(id: string): Promise<void>;
    findWithPayments(id: string): Promise<(CollectionAccountEntity & {
        payments: CollectionPaymentEntity[];
    }) | null>;
}
export interface ICollectionPaymentRepository {
    findAll(): Promise<CollectionPaymentEntity[]>;
    findById(id: string): Promise<CollectionPaymentEntity | null>;
    findByCollectionAccount(collectionAccountId: string): Promise<CollectionPaymentEntity[]>;
    create(data: {
        amount: number;
        paymentMethodId: string;
        reference?: string;
        collectionAccountId: string;
    }): Promise<CollectionPaymentEntity>;
}
export interface ICategoryRepository {
    findAll(includeInactive?: boolean): Promise<CategoryEntity[]>;
    findById(id: string): Promise<CategoryEntity | null>;
    findByName(name: string): Promise<CategoryEntity | null>;
    create(data: {
        name: string;
        description?: string;
        icon?: string;
    }): Promise<CategoryEntity>;
    update(id: string, data: Partial<{
        name: string;
        description: string;
        icon: string;
        isActive: boolean;
    }>): Promise<CategoryEntity>;
    delete(id: string): Promise<void>;
}
export interface IAccountRepository {
    findAll(includeInactive?: boolean): Promise<AccountEntity[]>;
    findById(id: string): Promise<AccountEntity | null>;
    findByName(name: string): Promise<AccountEntity | null>;
    findByType(type: string): Promise<AccountEntity[]>;
    create(data: {
        name: string;
        type?: string;
    }): Promise<AccountEntity>;
    update(id: string, data: Partial<{
        name: string;
        type: string;
        isActive: boolean;
    }>): Promise<AccountEntity>;
    delete(id: string): Promise<void>;
}
export interface IPaymentMethodRepository {
    findAll(includeInactive?: boolean): Promise<PaymentMethodEntity[]>;
    findById(id: string): Promise<PaymentMethodEntity | null>;
    findByName(name: string): Promise<PaymentMethodEntity | null>;
    findByAccount(accountId: string): Promise<PaymentMethodEntity[]>;
    create(data: {
        name: string;
        accountId: string;
    }): Promise<PaymentMethodEntity>;
    update(id: string, data: Partial<{
        name: string;
        accountId: string;
        isActive: boolean;
    }>): Promise<PaymentMethodEntity>;
    delete(id: string): Promise<void>;
}
export interface ICashRegisterRepository {
    findOpenRegister(): Promise<CashRegisterEntity | null>;
    findAll(filters?: {
        startDate?: Date;
        endDate?: Date;
        status?: string;
    }): Promise<CashRegisterEntity[]>;
    findById(id: string): Promise<CashRegisterEntity | null>;
    create(data: {
        initialAmount: number;
        openedBy: string;
        notes?: string;
    }): Promise<CashRegisterEntity>;
    update(id: string, data: Partial<{
        finalAmount: number;
        status: string;
        closedBy: string;
        closedAt: Date;
        notes: string;
    }>): Promise<CashRegisterEntity>;
    closeRegister(id: string, data: {
        finalAmount: number;
        closedBy: string;
        notes?: string;
    }): Promise<CashRegisterEntity>;
    findMovementsByRegister(cashRegisterId: string): Promise<CashMovementEntity[]>;
    findMovementsByAccountAndDate(accountId: string, startDate: Date, endDate: Date): Promise<CashMovementEntity[]>;
    createMovement(data: {
        cashRegisterId: string;
        accountId: string;
        amount: number;
        type: string;
        description?: string;
        reference?: string;
        paymentId?: string;
    }): Promise<CashMovementEntity>;
}
//# sourceMappingURL=index.d.ts.map