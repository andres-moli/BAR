import { LoginDTOType, RegisterDTOType, AuthResponseDTO, CreateTableDTOType, UpdateTableDTOType, TableResponseDTO, CreateProductDTOType, UpdateProductDTOType, ProductResponseDTO, CreateOrderDTOType, AddItemDTOType, UpdateItemDTOType, OrderResponseDTO, OrderItemResponseDTO, ProcessPaymentDTOType, PaymentResponseDTO, CreateClientDTOType, UpdateClientDTOType, ClientResponseDTO, CreateCollectionAccountDTOType, RegisterPaymentDTOType, CollectionResponseDTO, CreateUserDTOType, UpdateUserDTOType, UserResponseDTO, ReportFilterDTOType, SalesReportDTO, CategoryResponseDTO, CreateCategoryDTOType, UpdateCategoryDTOType, AccountResponseDTO, CreateAccountDTOType, UpdateAccountDTOType, PaymentMethodResponseDTO, CreatePaymentMethodDTOType, UpdatePaymentMethodDTOType, CashRegisterResponseDTO, OpenCashRegisterDTOType, CloseCashRegisterDTOType, CashMovementResponseDTO, CashRegisterSummaryDTO } from '../dtos';
import { OrderStatus, TableStatus } from '../../domain/value-objects/index';
export interface IAuthService {
    login(dto: LoginDTOType): Promise<AuthResponseDTO>;
    register(dto: RegisterDTOType): Promise<AuthResponseDTO>;
    validateToken(token: string): Promise<UserResponseDTO>;
    refreshToken(token: string): Promise<AuthResponseDTO>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
export interface ITableService {
    findAll(): Promise<TableResponseDTO[]>;
    findById(id: string): Promise<TableResponseDTO>;
    findByStatus(status: TableStatus): Promise<TableResponseDTO[]>;
    create(dto: CreateTableDTOType): Promise<TableResponseDTO>;
    update(id: string, dto: UpdateTableDTOType): Promise<TableResponseDTO>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: TableStatus): Promise<TableResponseDTO>;
}
export interface IProductService {
    findAll(): Promise<ProductResponseDTO[]>;
    findById(id: string): Promise<ProductResponseDTO>;
    findByCategory(categoryId: string): Promise<ProductResponseDTO[]>;
    findActive(): Promise<ProductResponseDTO[]>;
    create(dto: CreateProductDTOType): Promise<ProductResponseDTO>;
    update(id: string, dto: UpdateProductDTOType): Promise<ProductResponseDTO>;
    delete(id: string): Promise<void>;
    updateStock(id: string, quantity: number): Promise<ProductResponseDTO>;
}
export interface IOrderService {
    findAll(): Promise<OrderResponseDTO[]>;
    findById(id: string): Promise<OrderResponseDTO>;
    findByStatus(status: OrderStatus): Promise<OrderResponseDTO[]>;
    findByTable(tableId: string): Promise<OrderResponseDTO[]>;
    create(dto: CreateOrderDTOType): Promise<OrderResponseDTO>;
    addItem(orderId: string, dto: AddItemDTOType): Promise<OrderItemResponseDTO>;
    updateItem(orderId: string, itemId: string, dto: UpdateItemDTOType): Promise<OrderItemResponseDTO>;
    removeItem(orderId: string, itemId: string): Promise<void>;
    updateStatus(orderId: string, status: OrderStatus): Promise<OrderResponseDTO>;
    closeOrder(orderId: string): Promise<OrderResponseDTO>;
    cancelOrder(orderId: string, reason?: string): Promise<OrderResponseDTO>;
}
export interface IPaymentService {
    processPayment(dto: ProcessPaymentDTOType): Promise<PaymentResponseDTO>;
    findPaymentsByOrder(orderId: string): Promise<PaymentResponseDTO[]>;
    findPaymentById(id: string): Promise<PaymentResponseDTO>;
    refundPayment(id: string): Promise<void>;
}
export interface IClientService {
    findAll(): Promise<ClientResponseDTO[]>;
    findById(id: string): Promise<ClientResponseDTO>;
    findByEmail(email: string): Promise<ClientResponseDTO | null>;
    create(dto: CreateClientDTOType): Promise<ClientResponseDTO>;
    update(id: string, dto: UpdateClientDTOType): Promise<ClientResponseDTO>;
    delete(id: string): Promise<void>;
}
export interface ICollectionAccountService {
    findAll(): Promise<CollectionResponseDTO[]>;
    findById(id: string): Promise<CollectionResponseDTO>;
    findByClient(clientId: string): Promise<CollectionResponseDTO[]>;
    findPending(): Promise<CollectionResponseDTO[]>;
    create(dto: CreateCollectionAccountDTOType): Promise<CollectionResponseDTO>;
    registerPayment(accountId: string, dto: RegisterPaymentDTOType): Promise<CollectionResponseDTO>;
    updateStatus(accountId: string): Promise<CollectionResponseDTO>;
    delete(id: string): Promise<void>;
}
export interface IUserService {
    findAll(): Promise<UserResponseDTO[]>;
    findById(id: string): Promise<UserResponseDTO>;
    findByRole(role: string): Promise<UserResponseDTO[]>;
    create(dto: CreateUserDTOType): Promise<UserResponseDTO>;
    update(id: string, dto: UpdateUserDTOType): Promise<UserResponseDTO>;
    delete(id: string): Promise<void>;
    activate(id: string): Promise<UserResponseDTO>;
    deactivate(id: string): Promise<UserResponseDTO>;
}
export interface IReportService {
    getSalesReport(filters: ReportFilterDTOType): Promise<SalesReportDTO>;
    getDailySales(date?: string): Promise<SalesReportDTO>;
    getProductPerformance(startDate: string, endDate: string): Promise<{
        productId: string;
        productName: string;
        quantitySold: number;
        totalRevenue: number;
    }[]>;
    getUserPerformance(userId: string, startDate: string, endDate: string): Promise<{
        userId: string;
        userName: string;
        totalOrders: number;
        totalSales: number;
    }>;
}
export interface IPrintService {
    printInvoice(orderId: string): Promise<void>;
    printReceipt(paymentId: string): Promise<void>;
    printOrder(orderId: string): Promise<void>;
    printReport(reportType: string, data: unknown): Promise<void>;
    printCollectionAccount(accountId: string): Promise<void>;
}
export interface ICategoryService {
    findAll(): Promise<CategoryResponseDTO[]>;
    findById(id: string): Promise<CategoryResponseDTO>;
    create(dto: CreateCategoryDTOType): Promise<CategoryResponseDTO>;
    update(id: string, dto: UpdateCategoryDTOType): Promise<CategoryResponseDTO>;
    delete(id: string): Promise<void>;
}
export interface IAccountService {
    findAll(): Promise<AccountResponseDTO[]>;
    findById(id: string): Promise<AccountResponseDTO>;
    findByType(type: string): Promise<AccountResponseDTO[]>;
    create(dto: CreateAccountDTOType): Promise<AccountResponseDTO>;
    update(id: string, dto: UpdateAccountDTOType): Promise<AccountResponseDTO>;
    delete(id: string): Promise<void>;
}
export interface IPaymentMethodService {
    findAll(): Promise<PaymentMethodResponseDTO[]>;
    findById(id: string): Promise<PaymentMethodResponseDTO>;
    findByAccount(accountId: string): Promise<PaymentMethodResponseDTO[]>;
    create(dto: CreatePaymentMethodDTOType): Promise<PaymentMethodResponseDTO>;
    update(id: string, dto: UpdatePaymentMethodDTOType): Promise<PaymentMethodResponseDTO>;
    delete(id: string): Promise<void>;
}
export interface ICashRegisterService {
    open(dto: OpenCashRegisterDTOType & {
        openedBy: string;
    }): Promise<CashRegisterResponseDTO>;
    close(id: string, dto: CloseCashRegisterDTOType & {
        closedBy: string;
    }): Promise<CashRegisterResponseDTO>;
    getCurrent(): Promise<CashRegisterResponseDTO | null>;
    getMovements(cashRegisterId: string): Promise<CashMovementResponseDTO[]>;
    getSummary(cashRegisterId: string): Promise<CashRegisterSummaryDTO>;
}
//# sourceMappingURL=index.d.ts.map