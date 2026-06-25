import { IUserRepository, ITableRepository, IProductRepository, IOrderRepository, IPaymentRepository, IClientRepository, ICollectionAccountRepository, ICollectionPaymentRepository, ICategoryRepository, IAccountRepository, IPaymentMethodRepository, ICashRegisterRepository } from '../../domain/repositories/index';
import { SafeUserEntity, UserEntity } from '../../domain/entities/index';
import { AuthService } from '../../infrastructure/auth/index';
export declare class LoginUseCase {
    private userRepo;
    private authService;
    constructor(userRepo: IUserRepository, authService: AuthService);
    execute(data: {
        email: string;
        password: string;
    }): Promise<{
        user: SafeUserEntity;
        token: string;
    }>;
}
export declare class RegisterUseCase {
    private userRepo;
    private authService;
    constructor(userRepo: IUserRepository, authService: AuthService);
    execute(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<{
        user: SafeUserEntity;
        token: string;
    }>;
}
export declare class GetProfileUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(userId: string): Promise<SafeUserEntity>;
}
export declare class UpdateProfileUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(userId: string, data: {
        name?: string;
        email?: string;
    }): Promise<SafeUserEntity>;
}
export declare class GetAllTablesUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(): Promise<import("../../domain/entities/index").TableEntity[]>;
}
export declare class GetTableByIdUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(id: string): Promise<import("../../domain/entities/index").TableEntity>;
}
export declare class CreateTableUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(data: {
        number: number;
        capacity?: number;
        location?: string;
    }): Promise<import("../../domain/entities/index").TableEntity>;
}
export declare class UpdateTableUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").TableEntity>;
    private getTableOrThrow;
}
export declare class DeleteTableUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(id: string): Promise<void>;
}
export declare class UpdateTableStatusUseCase {
    private tableRepo;
    constructor(tableRepo: ITableRepository);
    execute(id: string, status: any): Promise<import("../../domain/entities/index").TableEntity>;
}
export declare class GetAllProductsUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(includeInactive?: boolean): Promise<import("../../domain/entities/index").ProductEntity[]>;
}
export declare class GetProductByIdUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(id: string): Promise<import("../../domain/entities/index").ProductEntity>;
}
export declare class GetProductsByCategoryUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(categoryId: string): Promise<import("../../domain/entities/index").ProductEntity[]>;
}
export declare class CreateProductUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(data: any): Promise<import("../../domain/entities/index").ProductEntity>;
}
export declare class UpdateProductUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").ProductEntity>;
}
export declare class DeleteProductUseCase {
    private productRepo;
    constructor(productRepo: IProductRepository);
    execute(id: string): Promise<void>;
}
export declare class GetAllCategoriesUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(includeInactive?: boolean): Promise<import("../../domain/entities/index").CategoryEntity[]>;
}
export declare class GetCategoryByIdUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(id: string): Promise<import("../../domain/entities/index").CategoryEntity>;
}
export declare class CreateCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(data: {
        name: string;
        description?: string;
        icon?: string;
    }): Promise<import("../../domain/entities/index").CategoryEntity>;
}
export declare class UpdateCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").CategoryEntity>;
}
export declare class DeleteCategoryUseCase {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    execute(id: string): Promise<void>;
}
export declare class GetAllAccountsUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(includeInactive?: boolean): Promise<import("../../domain/entities/index").AccountEntity[]>;
}
export declare class GetAccountByIdUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(id: string): Promise<import("../../domain/entities/index").AccountEntity>;
}
export declare class GetAccountsByTypeUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(type: string): Promise<import("../../domain/entities/index").AccountEntity[]>;
}
export declare class CreateAccountUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(data: {
        name: string;
        type?: string;
    }): Promise<import("../../domain/entities/index").AccountEntity>;
}
export declare class UpdateAccountUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").AccountEntity>;
}
export declare class DeleteAccountUseCase {
    private accountRepo;
    constructor(accountRepo: IAccountRepository);
    execute(id: string): Promise<void>;
}
export declare class GetAllPaymentMethodsUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(includeInactive?: boolean): Promise<import("../../domain/entities/index").PaymentMethodEntity[]>;
}
export declare class GetPaymentMethodByIdUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(id: string): Promise<import("../../domain/entities/index").PaymentMethodEntity>;
}
export declare class GetPaymentMethodsByAccountUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(accountId: string): Promise<import("../../domain/entities/index").PaymentMethodEntity[]>;
}
export declare class CreatePaymentMethodUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(data: {
        name: string;
        accountId: string;
    }): Promise<import("../../domain/entities/index").PaymentMethodEntity>;
}
export declare class UpdatePaymentMethodUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").PaymentMethodEntity>;
}
export declare class DeletePaymentMethodUseCase {
    private pmRepo;
    constructor(pmRepo: IPaymentMethodRepository);
    execute(id: string): Promise<void>;
}
export declare class CreateOrderUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(data: {
        tableId?: string;
        userId: string;
        clientId?: string;
        notes?: string;
    }): Promise<import("../../domain/entities/index").OrderEntity>;
}
export declare class GetOrderByIdUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(id: string): Promise<import("../../domain/entities/index").OrderEntity & {
        items: (import("../../domain/entities/index").OrderItemEntity & {
            product: import("../../domain/entities/index").ProductEntity;
        })[];
        table: import("../../domain/entities/index").TableEntity | null;
        user: SafeUserEntity;
        client: import("../../domain/entities/index").ClientEntity | null;
    }>;
}
export declare class GetAllOrdersUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(filters?: any): Promise<import("../../domain/entities/index").OrderEntity[]>;
}
export declare class AddItemToOrderUseCase {
    private orderRepo;
    private productRepo;
    constructor(orderRepo: IOrderRepository, productRepo: IProductRepository);
    execute(data: {
        orderId: string;
        productId: string;
        quantity: number;
        notes?: string;
        userId: string;
    }): Promise<import("../../domain/entities/index").OrderItemEntity>;
    private recalculateOrder;
}
export declare class UpdateOrderItemUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(id: string, data: {
        quantity?: number;
        notes?: string;
    }): Promise<import("../../domain/entities/index").OrderItemEntity>;
}
export declare class RemoveOrderItemUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(id: string): Promise<void>;
}
export declare class ChangeTableUseCase {
    private orderRepo;
    private tableRepo;
    constructor(orderRepo: IOrderRepository, tableRepo: ITableRepository);
    execute(orderId: string, tableId: string): Promise<import("../../domain/entities/index").OrderEntity>;
}
export declare class SplitOrderUseCase {
    private orderRepo;
    private tableRepo;
    constructor(orderRepo: IOrderRepository, tableRepo: ITableRepository);
    execute(orderId: string, data: {
        items: {
            itemId: string;
            quantity: number;
        }[];
        tableId?: string;
    }): Promise<(import("../../domain/entities/index").OrderEntity & {
        items: (import("../../domain/entities/index").OrderItemEntity & {
            product: import("../../domain/entities/index").ProductEntity;
        })[];
        table: import("../../domain/entities/index").TableEntity | null;
        user: SafeUserEntity;
        client: import("../../domain/entities/index").ClientEntity | null;
    }) | null>;
}
export declare class GetOrderHistoryUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(orderId: string): Promise<import("../../domain/entities/index").OrderEntity[]>;
}
export declare class ProcessPaymentUseCase {
    private paymentRepo;
    private orderRepo;
    constructor(paymentRepo: IPaymentRepository, orderRepo: IOrderRepository);
    execute(data: {
        orderId: string;
        amount: number;
        paymentMethodId: string;
        reference?: string;
        userId: string;
    }): Promise<import("../../domain/entities/index").PaymentEntity>;
}
export declare class GetPaymentsByOrderUseCase {
    private paymentRepo;
    constructor(paymentRepo: IPaymentRepository);
    execute(orderId: string): Promise<import("../../domain/entities/index").PaymentEntity[]>;
}
export declare class OpenCashRegisterUseCase {
    private cashRegisterRepo;
    constructor(cashRegisterRepo: ICashRegisterRepository);
    execute(data: {
        initialAmount: number;
        openedBy: string;
        notes?: string;
    }): Promise<import("../../domain/entities/index").CashRegisterEntity>;
}
export declare class CloseCashRegisterUseCase {
    private cashRegisterRepo;
    constructor(cashRegisterRepo: ICashRegisterRepository);
    execute(id: string, data: {
        finalAmount: number;
        closedBy: string;
        notes?: string;
    }): Promise<import("../../domain/entities/index").CashRegisterEntity>;
}
export declare class GetCurrentCashRegisterUseCase {
    private cashRegisterRepo;
    constructor(cashRegisterRepo: ICashRegisterRepository);
    execute(): Promise<import("../../domain/entities/index").CashRegisterEntity | null>;
}
export declare class GetCashRegisterMovementsUseCase {
    private cashRegisterRepo;
    constructor(cashRegisterRepo: ICashRegisterRepository);
    execute(cashRegisterId: string): Promise<import("../../domain/entities/index").CashMovementEntity[]>;
}
export declare class GetCashRegisterSummaryUseCase {
    private cashRegisterRepo;
    private accountRepo;
    constructor(cashRegisterRepo: ICashRegisterRepository, accountRepo: IAccountRepository);
    execute(cashRegisterId: string): Promise<{
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
            movements: any[];
        }[];
    }>;
}
export declare class GetAllClientsUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(): Promise<import("../../domain/entities/index").ClientEntity[]>;
}
export declare class GetClientByIdUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(id: string): Promise<import("../../domain/entities/index").ClientEntity>;
}
export declare class CreateClientUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(data: {
        name: string;
        email?: string;
        phone?: string;
        document?: string;
        address?: string;
    }): Promise<import("../../domain/entities/index").ClientEntity>;
}
export declare class UpdateClientUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(id: string, data: any): Promise<import("../../domain/entities/index").ClientEntity>;
}
export declare class DeleteClientUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(id: string): Promise<void>;
}
export declare class GetClientHistoryUseCase {
    private clientRepo;
    constructor(clientRepo: IClientRepository);
    execute(clientId: string): Promise<import("../../domain/entities/index").OrderEntity[]>;
}
export declare class GetAllCollectionsUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(filters?: any): Promise<import("../../domain/entities/index").CollectionAccountEntity[]>;
}
export declare class GetCollectionByIdUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(id: string): Promise<import("../../domain/entities/index").CollectionAccountEntity & {
        client: import("../../domain/entities/index").ClientEntity;
        payments: import("../../domain/entities/index").CollectionPaymentEntity[];
    }>;
}
export declare class CreateCollectionUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(data: {
        totalAmount: number;
        clientId: string;
        notes?: string;
        dueDate?: Date;
    }): Promise<import("../../domain/entities/index").CollectionAccountEntity>;
}
export declare class RegisterCollectionPaymentUseCase {
    private collectionPaymentRepo;
    private collectionRepo;
    constructor(collectionPaymentRepo: ICollectionPaymentRepository, collectionRepo: ICollectionAccountRepository);
    execute(data: {
        amount: number;
        paymentMethodId: string;
        reference?: string;
        collectionAccountId: string;
    }): Promise<import("../../domain/entities/index").CollectionPaymentEntity>;
}
export declare class GetCollectionHistoryUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(collectionId: string): Promise<(import("../../domain/entities/index").CollectionAccountEntity & {
        payments: import("../../domain/entities/index").CollectionPaymentEntity[];
    }) | null>;
}
export declare class GetAllUsersUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(): Promise<UserEntity[]>;
}
export declare class GetUserByIdUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../domain/value-objects/index").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class CreateUserUseCase {
    private userRepo;
    private authService;
    constructor(userRepo: IUserRepository, authService: AuthService);
    execute(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../domain/value-objects/index").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class UpdateUserUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../domain/value-objects/index").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class DeleteUserUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string): Promise<void>;
}
export declare class SalesByDayUseCase {
    private orderRepo;
    private paymentRepo;
    constructor(orderRepo: IOrderRepository, paymentRepo: IPaymentRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        count: number;
        total: number;
        orders: string[];
        date: string;
    }[]>;
}
export declare class SalesByMonthUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        count: number;
        total: number;
        month: string;
    }[]>;
}
export declare class SalesByProductUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        name: string;
        quantity: number;
        total: number;
        categoryId: string;
        productId: string;
    }[]>;
}
export declare class SalesByCategoryUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        quantity: number;
        total: number;
        categoryId: string;
    }[]>;
}
export declare class SalesByUserUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        count: number;
        total: number;
        userId: string;
    }[]>;
}
export declare class TopProductsUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(limit?: number, startDate?: Date, endDate?: Date): Promise<{
        productId: string;
        name: string;
        quantity: number;
        total: number;
    }[]>;
}
export declare class PaymentMethodsUseCase {
    private paymentRepo;
    constructor(paymentRepo: IPaymentRepository);
    execute(startDate?: Date, endDate?: Date): Promise<{
        count: number;
        total: number;
        paymentMethodId: string;
    }[]>;
}
export declare class CollectionsReportUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(): Promise<import("../../domain/entities/index").CollectionAccountEntity[]>;
}
export declare class ClientsWithDebtUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(): Promise<{
        clientId: string;
        totalDebt: number;
        totalPaid: number;
        balance: number;
    }[]>;
}
export declare class PrintOrderUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(orderId: string): Promise<import("../../domain/entities/index").OrderEntity & {
        items: (import("../../domain/entities/index").OrderItemEntity & {
            product: import("../../domain/entities/index").ProductEntity;
        })[];
        table: import("../../domain/entities/index").TableEntity | null;
        user: SafeUserEntity;
        client: import("../../domain/entities/index").ClientEntity | null;
    }>;
}
export declare class PrintPreBillUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(orderId: string): Promise<import("../../domain/entities/index").OrderEntity & {
        items: (import("../../domain/entities/index").OrderItemEntity & {
            product: import("../../domain/entities/index").ProductEntity;
        })[];
        table: import("../../domain/entities/index").TableEntity | null;
        user: SafeUserEntity;
        client: import("../../domain/entities/index").ClientEntity | null;
    }>;
}
export declare class PrintInvoiceUseCase {
    private orderRepo;
    constructor(orderRepo: IOrderRepository);
    execute(orderId: string): Promise<import("../../domain/entities/index").OrderEntity & {
        items: (import("../../domain/entities/index").OrderItemEntity & {
            product: import("../../domain/entities/index").ProductEntity;
        })[];
        table: import("../../domain/entities/index").TableEntity | null;
        user: SafeUserEntity;
        client: import("../../domain/entities/index").ClientEntity | null;
    }>;
}
export declare class PrintCollectionAccountUseCase {
    private collectionRepo;
    constructor(collectionRepo: ICollectionAccountRepository);
    execute(collectionId: string): Promise<import("../../domain/entities/index").CollectionAccountEntity & {
        client: import("../../domain/entities/index").ClientEntity;
        payments: import("../../domain/entities/index").CollectionPaymentEntity[];
    }>;
}
//# sourceMappingURL=index.d.ts.map