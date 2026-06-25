"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintController = exports.ReportController = exports.UserController = exports.CollectionAccountController = exports.ClientController = exports.PaymentController = exports.OrderController = exports.CashRegisterController = exports.PaymentMethodController = exports.AccountController = exports.CategoryController = exports.ProductController = exports.TableController = exports.AuthController = void 0;
const wrap = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
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
class AuthController {
    loginUseCase;
    registerUseCase;
    getProfileUseCase;
    updateProfileUseCase;
    constructor(loginUseCase, registerUseCase, getProfileUseCase, updateProfileUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.getProfileUseCase = getProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
    }
    login = wrap(async (req, res) => {
        const result = await this.loginUseCase.execute(req.body);
        res.json({ success: true, data: result });
    });
    register = wrap(async (req, res) => {
        const result = await this.registerUseCase.execute(req.body);
        res.status(201).json({ success: true, data: result });
    });
    getProfile = wrap(async (req, res) => {
        const user = await this.getProfileUseCase.execute(req.user.id);
        res.json({ success: true, data: user });
    });
    updateProfile = wrap(async (req, res) => {
        const user = await this.updateProfileUseCase.execute(req.user.id, req.body);
        res.json({ success: true, data: user });
    });
}
exports.AuthController = AuthController;
class TableController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    updateStatusUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase, updateStatusUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
    }
    getAll = wrap(async (_req, res) => {
        const tables = await this.getAllUseCase.execute();
        res.json({ success: true, data: tables });
    });
    getById = wrap(async (req, res) => {
        const table = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: table });
    });
    create = wrap(async (req, res) => {
        const table = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: table });
    });
    update = wrap(async (req, res) => {
        const table = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: table });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
    updateStatus = wrap(async (req, res) => {
        const table = await this.updateStatusUseCase.execute(req.params.id, req.body.status);
        res.json({ success: true, data: table });
    });
}
exports.TableController = TableController;
class ProductController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    getByCategoryUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase, getByCategoryUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
        this.getByCategoryUseCase = getByCategoryUseCase;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const products = await this.getAllUseCase.execute(includeInactive);
        res.json({ success: true, data: products });
    });
    getById = wrap(async (req, res) => {
        const product = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: product });
    });
    create = wrap(async (req, res) => {
        const product = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: product });
    });
    update = wrap(async (req, res) => {
        const product = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: product });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
    getByCategory = wrap(async (req, res) => {
        const products = await this.getByCategoryUseCase.execute(req.params.categoryId);
        res.json({ success: true, data: products });
    });
}
exports.ProductController = ProductController;
// ─── Category Controller ──────────────────────────────────────────────────────
class CategoryController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const categories = await this.getAllUseCase.execute(includeInactive);
        res.json({ success: true, data: categories });
    });
    getById = wrap(async (req, res) => {
        const cat = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: cat });
    });
    create = wrap(async (req, res) => {
        const cat = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: cat });
    });
    update = wrap(async (req, res) => {
        const cat = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: cat });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.CategoryController = CategoryController;
// ─── Account Controller ───────────────────────────────────────────────────────
class AccountController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const accounts = await this.getAllUseCase.execute(includeInactive);
        res.json({ success: true, data: accounts });
    });
    getById = wrap(async (req, res) => {
        const acc = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: acc });
    });
    create = wrap(async (req, res) => {
        const acc = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: acc });
    });
    update = wrap(async (req, res) => {
        const acc = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: acc });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.AccountController = AccountController;
// ─── Payment Method Controller ────────────────────────────────────────────────
class PaymentMethodController {
    getAllUseCase;
    getByIdUseCase;
    getByAccountUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    constructor(getAllUseCase, getByIdUseCase, getByAccountUseCase, createUseCase, updateUseCase, deleteUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.getByAccountUseCase = getByAccountUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const methods = await this.getAllUseCase.execute(includeInactive);
        res.json({ success: true, data: methods });
    });
    getById = wrap(async (req, res) => {
        const method = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: method });
    });
    getByAccount = wrap(async (req, res) => {
        const methods = await this.getByAccountUseCase.execute(req.params.accountId);
        res.json({ success: true, data: methods });
    });
    create = wrap(async (req, res) => {
        const method = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: method });
    });
    update = wrap(async (req, res) => {
        const method = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: method });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.PaymentMethodController = PaymentMethodController;
// ─── Cash Register Controller ─────────────────────────────────────────────────
class CashRegisterController {
    openUseCase;
    closeUseCase;
    getCurrentUseCase;
    getMovementsUseCase;
    getSummaryUseCase;
    constructor(openUseCase, closeUseCase, getCurrentUseCase, getMovementsUseCase, getSummaryUseCase) {
        this.openUseCase = openUseCase;
        this.closeUseCase = closeUseCase;
        this.getCurrentUseCase = getCurrentUseCase;
        this.getMovementsUseCase = getMovementsUseCase;
        this.getSummaryUseCase = getSummaryUseCase;
    }
    open = wrap(async (req, res) => {
        const reg = await this.openUseCase.execute({ ...req.body, openedBy: req.user.id });
        res.status(201).json({ success: true, data: reg });
    });
    close = wrap(async (req, res) => {
        const id = req.params.id || req.body.cashRegisterId;
        const reg = await this.closeUseCase.execute(id, { ...req.body, closedBy: req.user.id });
        res.json({ success: true, data: reg });
    });
    getCurrent = wrap(async (_req, res) => {
        const reg = await this.getCurrentUseCase.execute();
        res.json({ success: true, data: reg });
    });
    getMovements = wrap(async (req, res) => {
        const cashRegisterId = req.params.id || req.query.cashRegisterId;
        const movements = await this.getMovementsUseCase.execute(cashRegisterId);
        res.json({ success: true, data: movements });
    });
    getSummary = wrap(async (req, res) => {
        const cashRegisterId = req.params.id || req.query.cashRegisterId;
        const summary = await this.getSummaryUseCase.execute(cashRegisterId);
        res.json({ success: true, data: summary });
    });
}
exports.CashRegisterController = CashRegisterController;
// ─── Order Controller ─────────────────────────────────────────────────────────
class OrderController {
    createUseCase;
    getByIdUseCase;
    getAllUseCase;
    addItemUseCase;
    updateItemUseCase;
    removeItemUseCase;
    changeTableUseCase;
    splitOrderUseCase;
    getHistoryUseCase;
    constructor(createUseCase, getByIdUseCase, getAllUseCase, addItemUseCase, updateItemUseCase, removeItemUseCase, changeTableUseCase, splitOrderUseCase, getHistoryUseCase) {
        this.createUseCase = createUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.getAllUseCase = getAllUseCase;
        this.addItemUseCase = addItemUseCase;
        this.updateItemUseCase = updateItemUseCase;
        this.removeItemUseCase = removeItemUseCase;
        this.changeTableUseCase = changeTableUseCase;
        this.splitOrderUseCase = splitOrderUseCase;
        this.getHistoryUseCase = getHistoryUseCase;
    }
    create = wrap(async (req, res) => {
        const order = await this.createUseCase.execute({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: order });
    });
    getById = wrap(async (req, res) => {
        const order = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: order });
    });
    getAll = wrap(async (req, res) => {
        const filters = {};
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.tableId)
            filters.tableId = req.query.tableId;
        if (req.query.userId)
            filters.userId = req.query.userId;
        if (req.query.clientId)
            filters.clientId = req.query.clientId;
        if (req.query.startDate)
            filters.startDate = new Date(req.query.startDate);
        if (req.query.endDate)
            filters.endDate = new Date(req.query.endDate);
        const orders = await this.getAllUseCase.execute(filters);
        res.json({ success: true, data: orders });
    });
    addItem = wrap(async (req, res) => {
        const item = await this.addItemUseCase.execute({
            ...req.body,
            orderId: req.params.id,
            userId: req.user.id,
        });
        res.status(201).json({ success: true, data: item });
    });
    updateItem = wrap(async (req, res) => {
        const item = await this.updateItemUseCase.execute(req.params.itemId, req.body);
        res.json({ success: true, data: item });
    });
    removeItem = wrap(async (req, res) => {
        await this.removeItemUseCase.execute(req.params.itemId);
        res.json({ success: true, data: null });
    });
    changeTable = wrap(async (req, res) => {
        const order = await this.changeTableUseCase.execute(req.params.id, req.body.tableId);
        res.json({ success: true, data: order });
    });
    splitOrder = wrap(async (req, res) => {
        const newOrder = await this.splitOrderUseCase.execute(req.params.id, req.body);
        res.status(201).json({ success: true, data: newOrder });
    });
    getHistory = wrap(async (req, res) => {
        const history = await this.getHistoryUseCase.execute(req.params.id);
        res.json({ success: true, data: history });
    });
}
exports.OrderController = OrderController;
class PaymentController {
    processUseCase;
    getByOrderUseCase;
    constructor(processUseCase, getByOrderUseCase) {
        this.processUseCase = processUseCase;
        this.getByOrderUseCase = getByOrderUseCase;
    }
    processPayment = wrap(async (req, res) => {
        const payment = await this.processUseCase.execute({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: payment });
    });
    getPaymentMethods = wrap(async (_req, res) => {
        const methods = ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'TRANSFER', 'NEQUI', 'DAVIPLATA', 'OTHER'];
        res.json({ success: true, data: methods });
    });
    getByOrder = wrap(async (req, res) => {
        const payments = await this.getByOrderUseCase.execute(req.params.orderId);
        res.json({ success: true, data: payments });
    });
}
exports.PaymentController = PaymentController;
class ClientController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    getHistoryUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase, getHistoryUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
        this.getHistoryUseCase = getHistoryUseCase;
    }
    getAll = wrap(async (_req, res) => {
        const clients = await this.getAllUseCase.execute();
        res.json({ success: true, data: clients });
    });
    getById = wrap(async (req, res) => {
        const client = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: client });
    });
    create = wrap(async (req, res) => {
        const client = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: client });
    });
    update = wrap(async (req, res) => {
        const client = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: client });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
    getHistory = wrap(async (req, res) => {
        const history = await this.getHistoryUseCase.execute(req.params.id);
        res.json({ success: true, data: history });
    });
}
exports.ClientController = ClientController;
class CollectionAccountController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    registerPaymentUseCase;
    getHistoryUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, registerPaymentUseCase, getHistoryUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.registerPaymentUseCase = registerPaymentUseCase;
        this.getHistoryUseCase = getHistoryUseCase;
    }
    getAll = wrap(async (req, res) => {
        const filters = {};
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.clientId)
            filters.clientId = req.query.clientId;
        const collections = await this.getAllUseCase.execute(filters);
        res.json({ success: true, data: collections });
    });
    getById = wrap(async (req, res) => {
        const collection = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: collection });
    });
    create = wrap(async (req, res) => {
        const data = req.body;
        if (data.dueDate)
            data.dueDate = new Date(data.dueDate);
        const collection = await this.createUseCase.execute(data);
        res.status(201).json({ success: true, data: collection });
    });
    registerPayment = wrap(async (req, res) => {
        const payment = await this.registerPaymentUseCase.execute({
            ...req.body,
            collectionAccountId: req.params.id,
        });
        res.status(201).json({ success: true, data: payment });
    });
    getHistory = wrap(async (req, res) => {
        const history = await this.getHistoryUseCase.execute(req.params.id);
        res.json({ success: true, data: history });
    });
}
exports.CollectionAccountController = CollectionAccountController;
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
class UserController {
    getAllUseCase;
    getByIdUseCase;
    createUseCase;
    updateUseCase;
    deleteUseCase;
    constructor(getAllUseCase, getByIdUseCase, createUseCase, updateUseCase, deleteUseCase) {
        this.getAllUseCase = getAllUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    getAll = wrap(async (_req, res) => {
        const users = await this.getAllUseCase.execute();
        res.json({ success: true, data: users });
    });
    getById = wrap(async (req, res) => {
        const user = await this.getByIdUseCase.execute(req.params.id);
        res.json({ success: true, data: user });
    });
    create = wrap(async (req, res) => {
        const user = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: user });
    });
    update = wrap(async (req, res) => {
        const user = await this.updateUseCase.execute(req.params.id, req.body);
        res.json({ success: true, data: user });
    });
    delete = wrap(async (req, res) => {
        await this.deleteUseCase.execute(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.UserController = UserController;
class ReportController {
    salesByDay;
    salesByMonth;
    salesByProduct;
    salesByCategory;
    salesByUser;
    topProducts;
    paymentMethods;
    collections;
    clientsWithDebt;
    constructor(salesByDay, salesByMonth, salesByProduct, salesByCategory, salesByUser, topProducts, paymentMethods, collections, clientsWithDebt) {
        this.salesByDay = salesByDay;
        this.salesByMonth = salesByMonth;
        this.salesByProduct = salesByProduct;
        this.salesByCategory = salesByCategory;
        this.salesByUser = salesByUser;
        this.topProducts = topProducts;
        this.paymentMethods = paymentMethods;
        this.collections = collections;
        this.clientsWithDebt = clientsWithDebt;
    }
    salesByDayHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.salesByDay.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByMonthHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.salesByMonth.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByProductHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.salesByProduct.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByCategoryHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.salesByCategory.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByUserHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.salesByUser.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    topProductsHandler = wrap(async (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.topProducts.execute(limit, startDate, endDate);
        res.json({ success: true, data });
    });
    paymentMethodsHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.paymentMethods.execute(startDate, endDate);
        res.json({ success: true, data });
    });
    collectionsHandler = wrap(async (_req, res) => {
        const data = await this.collections.execute();
        res.json({ success: true, data });
    });
    clientsWithDebtHandler = wrap(async (_req, res) => {
        const data = await this.clientsWithDebt.execute();
        res.json({ success: true, data });
    });
}
exports.ReportController = ReportController;
class PrintController {
    printOrder;
    printPreBill;
    printInvoice;
    printCollection;
    constructor(printOrder, printPreBill, printInvoice, printCollection) {
        this.printOrder = printOrder;
        this.printPreBill = printPreBill;
        this.printInvoice = printInvoice;
        this.printCollection = printCollection;
    }
    printOrderHandler = wrap(async (req, res) => {
        const data = await this.printOrder.execute(req.body.orderId);
        res.json({ success: true, data });
    });
    printPreBillHandler = wrap(async (req, res) => {
        const data = await this.printPreBill.execute(req.body.orderId);
        res.json({ success: true, data });
    });
    printInvoiceHandler = wrap(async (req, res) => {
        const data = await this.printInvoice.execute(req.body.orderId);
        res.json({ success: true, data });
    });
    printCollectionHandler = wrap(async (req, res) => {
        const data = await this.printCollection.execute(req.body.collectionId);
        res.json({ success: true, data });
    });
}
exports.PrintController = PrintController;
//# sourceMappingURL=index.js.map