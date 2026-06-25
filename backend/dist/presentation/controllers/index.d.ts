import { Request, Response, NextFunction } from 'express';
import { LoginUseCase, RegisterUseCase, GetProfileUseCase, UpdateProfileUseCase, GetAllTablesUseCase, GetTableByIdUseCase, CreateTableUseCase, UpdateTableUseCase, DeleteTableUseCase, UpdateTableStatusUseCase, GetAllProductsUseCase, GetProductByIdUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase, GetProductsByCategoryUseCase, CreateOrderUseCase, GetOrderByIdUseCase, GetAllOrdersUseCase, AddItemToOrderUseCase, UpdateOrderItemUseCase, RemoveOrderItemUseCase, ChangeTableUseCase, SplitOrderUseCase, GetOrderHistoryUseCase, ProcessPaymentUseCase, GetPaymentsByOrderUseCase, GetAllClientsUseCase, GetClientByIdUseCase, CreateClientUseCase, UpdateClientUseCase, DeleteClientUseCase, GetClientHistoryUseCase, GetAllCollectionsUseCase, GetCollectionByIdUseCase, CreateCollectionUseCase, RegisterCollectionPaymentUseCase, GetCollectionHistoryUseCase, GetAllUsersUseCase, GetUserByIdUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, SalesByDayUseCase, SalesByMonthUseCase, SalesByProductUseCase, SalesByCategoryUseCase, SalesByUserUseCase, TopProductsUseCase, PaymentMethodsUseCase, CollectionsReportUseCase, ClientsWithDebtUseCase, PrintOrderUseCase, PrintPreBillUseCase, PrintInvoiceUseCase, PrintCollectionAccountUseCase, GetAllCategoriesUseCase, GetCategoryByIdUseCase, CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase, GetAllAccountsUseCase, GetAccountByIdUseCase, CreateAccountUseCase, UpdateAccountUseCase, DeleteAccountUseCase, GetAllPaymentMethodsUseCase, GetPaymentMethodByIdUseCase, GetPaymentMethodsByAccountUseCase, CreatePaymentMethodUseCase, UpdatePaymentMethodUseCase, DeletePaymentMethodUseCase, OpenCashRegisterUseCase, CloseCashRegisterUseCase, GetCurrentCashRegisterUseCase, GetCashRegisterMovementsUseCase, GetCashRegisterSummaryUseCase } from '../../application/use-cases/index';
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@bar.com
 *         password:
 *           type: string
 *           format: password
 *           example: admin123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             user:
 *               $ref: '#/components/schemas/UserResponse'
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate user and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *   put:
 *     tags: [Auth]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated
 *
 * tags:
 *   - name: Auth
 *     description: Authentication and profile management
 */
export declare class AuthController {
    private loginUseCase;
    private registerUseCase;
    private getProfileUseCase;
    private updateProfileUseCase;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase, getProfileUseCase: GetProfileUseCase, updateProfileUseCase: UpdateProfileUseCase);
    login: Handler;
    register: Handler;
    getProfile: Handler;
    updateProfile: Handler;
}
export declare class TableController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    private updateStatusUseCase;
    constructor(getAllUseCase: GetAllTablesUseCase, getByIdUseCase: GetTableByIdUseCase, createUseCase: CreateTableUseCase, updateUseCase: UpdateTableUseCase, deleteUseCase: DeleteTableUseCase, updateStatusUseCase: UpdateTableStatusUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
    updateStatus: Handler;
}
export declare class ProductController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    private getByCategoryUseCase;
    constructor(getAllUseCase: GetAllProductsUseCase, getByIdUseCase: GetProductByIdUseCase, createUseCase: CreateProductUseCase, updateUseCase: UpdateProductUseCase, deleteUseCase: DeleteProductUseCase, getByCategoryUseCase: GetProductsByCategoryUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
    getByCategory: Handler;
}
export declare class CategoryController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    constructor(getAllUseCase: GetAllCategoriesUseCase, getByIdUseCase: GetCategoryByIdUseCase, createUseCase: CreateCategoryUseCase, updateUseCase: UpdateCategoryUseCase, deleteUseCase: DeleteCategoryUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export declare class AccountController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    constructor(getAllUseCase: GetAllAccountsUseCase, getByIdUseCase: GetAccountByIdUseCase, createUseCase: CreateAccountUseCase, updateUseCase: UpdateAccountUseCase, deleteUseCase: DeleteAccountUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export declare class PaymentMethodController {
    private getAllUseCase;
    private getByIdUseCase;
    private getByAccountUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    constructor(getAllUseCase: GetAllPaymentMethodsUseCase, getByIdUseCase: GetPaymentMethodByIdUseCase, getByAccountUseCase: GetPaymentMethodsByAccountUseCase, createUseCase: CreatePaymentMethodUseCase, updateUseCase: UpdatePaymentMethodUseCase, deleteUseCase: DeletePaymentMethodUseCase);
    getAll: Handler;
    getById: Handler;
    getByAccount: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export declare class CashRegisterController {
    private openUseCase;
    private closeUseCase;
    private getCurrentUseCase;
    private getMovementsUseCase;
    private getSummaryUseCase;
    constructor(openUseCase: OpenCashRegisterUseCase, closeUseCase: CloseCashRegisterUseCase, getCurrentUseCase: GetCurrentCashRegisterUseCase, getMovementsUseCase: GetCashRegisterMovementsUseCase, getSummaryUseCase: GetCashRegisterSummaryUseCase);
    open: Handler;
    close: Handler;
    getCurrent: Handler;
    getMovements: Handler;
    getSummary: Handler;
}
export declare class OrderController {
    private createUseCase;
    private getByIdUseCase;
    private getAllUseCase;
    private addItemUseCase;
    private updateItemUseCase;
    private removeItemUseCase;
    private changeTableUseCase;
    private splitOrderUseCase;
    private getHistoryUseCase;
    constructor(createUseCase: CreateOrderUseCase, getByIdUseCase: GetOrderByIdUseCase, getAllUseCase: GetAllOrdersUseCase, addItemUseCase: AddItemToOrderUseCase, updateItemUseCase: UpdateOrderItemUseCase, removeItemUseCase: RemoveOrderItemUseCase, changeTableUseCase: ChangeTableUseCase, splitOrderUseCase: SplitOrderUseCase, getHistoryUseCase: GetOrderHistoryUseCase);
    create: Handler;
    getById: Handler;
    getAll: Handler;
    addItem: Handler;
    updateItem: Handler;
    removeItem: Handler;
    changeTable: Handler;
    splitOrder: Handler;
    getHistory: Handler;
}
export declare class PaymentController {
    private processUseCase;
    private getByOrderUseCase;
    constructor(processUseCase: ProcessPaymentUseCase, getByOrderUseCase: GetPaymentsByOrderUseCase);
    processPayment: Handler;
    getPaymentMethods: Handler;
    getByOrder: Handler;
}
export declare class ClientController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    private getHistoryUseCase;
    constructor(getAllUseCase: GetAllClientsUseCase, getByIdUseCase: GetClientByIdUseCase, createUseCase: CreateClientUseCase, updateUseCase: UpdateClientUseCase, deleteUseCase: DeleteClientUseCase, getHistoryUseCase: GetClientHistoryUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
    getHistory: Handler;
}
export declare class CollectionAccountController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private registerPaymentUseCase;
    private getHistoryUseCase;
    constructor(getAllUseCase: GetAllCollectionsUseCase, getByIdUseCase: GetCollectionByIdUseCase, createUseCase: CreateCollectionUseCase, registerPaymentUseCase: RegisterCollectionPaymentUseCase, getHistoryUseCase: GetCollectionHistoryUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    registerPayment: Handler;
    getHistory: Handler;
}
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: waiter@bar.com
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User password (min 6 characters)
 *           example: password123
 *         name:
 *           type: string
 *           description: User full name
 *           example: Juan Pérez
 *         role:
 *           type: string
 *           enum: [ADMIN, CASHIER, WAITER]
 *           description: User role
 *           example: WAITER
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, CASHIER, WAITER]
 *         isActive:
 *           type: boolean
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, CASHIER, WAITER]
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 * tags:
 *   - name: Users
 *     description: User management (admin only)
 */
/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted
 */
export declare class UserController {
    private getAllUseCase;
    private getByIdUseCase;
    private createUseCase;
    private updateUseCase;
    private deleteUseCase;
    constructor(getAllUseCase: GetAllUsersUseCase, getByIdUseCase: GetUserByIdUseCase, createUseCase: CreateUserUseCase, updateUseCase: UpdateUserUseCase, deleteUseCase: DeleteUserUseCase);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export declare class ReportController {
    private salesByDay;
    private salesByMonth;
    private salesByProduct;
    private salesByCategory;
    private salesByUser;
    private topProducts;
    private paymentMethods;
    private collections;
    private clientsWithDebt;
    constructor(salesByDay: SalesByDayUseCase, salesByMonth: SalesByMonthUseCase, salesByProduct: SalesByProductUseCase, salesByCategory: SalesByCategoryUseCase, salesByUser: SalesByUserUseCase, topProducts: TopProductsUseCase, paymentMethods: PaymentMethodsUseCase, collections: CollectionsReportUseCase, clientsWithDebt: ClientsWithDebtUseCase);
    salesByDayHandler: Handler;
    salesByMonthHandler: Handler;
    salesByProductHandler: Handler;
    salesByCategoryHandler: Handler;
    salesByUserHandler: Handler;
    topProductsHandler: Handler;
    paymentMethodsHandler: Handler;
    collectionsHandler: Handler;
    clientsWithDebtHandler: Handler;
}
export declare class PrintController {
    private printOrder;
    private printPreBill;
    private printInvoice;
    private printCollection;
    constructor(printOrder: PrintOrderUseCase, printPreBill: PrintPreBillUseCase, printInvoice: PrintInvoiceUseCase, printCollection: PrintCollectionAccountUseCase);
    printOrderHandler: Handler;
    printPreBillHandler: Handler;
    printInvoiceHandler: Handler;
    printCollectionHandler: Handler;
}
export {};
//# sourceMappingURL=index.d.ts.map