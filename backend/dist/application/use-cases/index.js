"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllClientsUseCase = exports.GetCashRegisterSummaryUseCase = exports.GetCashRegisterMovementsUseCase = exports.GetCurrentCashRegisterUseCase = exports.CloseCashRegisterUseCase = exports.OpenCashRegisterUseCase = exports.GetPaymentsByOrderUseCase = exports.ProcessPaymentUseCase = exports.GetOrderHistoryUseCase = exports.SplitOrderUseCase = exports.ChangeTableUseCase = exports.RemoveOrderItemUseCase = exports.UpdateOrderItemUseCase = exports.AddItemToOrderUseCase = exports.GetAllOrdersUseCase = exports.GetOrderByIdUseCase = exports.CreateOrderUseCase = exports.DeletePaymentMethodUseCase = exports.UpdatePaymentMethodUseCase = exports.CreatePaymentMethodUseCase = exports.GetPaymentMethodsByAccountUseCase = exports.GetPaymentMethodByIdUseCase = exports.GetAllPaymentMethodsUseCase = exports.DeleteAccountUseCase = exports.UpdateAccountUseCase = exports.CreateAccountUseCase = exports.GetAccountsByTypeUseCase = exports.GetAccountByIdUseCase = exports.GetAllAccountsUseCase = exports.DeleteCategoryUseCase = exports.UpdateCategoryUseCase = exports.CreateCategoryUseCase = exports.GetCategoryByIdUseCase = exports.GetAllCategoriesUseCase = exports.DeleteProductUseCase = exports.UpdateProductUseCase = exports.CreateProductUseCase = exports.GetProductsByCategoryUseCase = exports.GetProductByIdUseCase = exports.GetAllProductsUseCase = exports.UpdateTableStatusUseCase = exports.DeleteTableUseCase = exports.UpdateTableUseCase = exports.CreateTableUseCase = exports.GetTableByIdUseCase = exports.GetAllTablesUseCase = exports.UpdateProfileUseCase = exports.GetProfileUseCase = exports.RegisterUseCase = exports.LoginUseCase = void 0;
exports.PrintCollectionAccountUseCase = exports.PrintInvoiceUseCase = exports.PrintPreBillUseCase = exports.PrintOrderUseCase = exports.ClientsWithDebtUseCase = exports.CollectionsReportUseCase = exports.PaymentMethodsUseCase = exports.TopProductsUseCase = exports.SalesByUserUseCase = exports.SalesByCategoryUseCase = exports.SalesByProductUseCase = exports.SalesByMonthUseCase = exports.SalesByDayUseCase = exports.DeleteUserUseCase = exports.UpdateUserUseCase = exports.CreateUserUseCase = exports.GetUserByIdUseCase = exports.GetAllUsersUseCase = exports.GetCollectionHistoryUseCase = exports.RegisterCollectionPaymentUseCase = exports.CreateCollectionUseCase = exports.GetCollectionByIdUseCase = exports.GetAllCollectionsUseCase = exports.GetClientHistoryUseCase = exports.DeleteClientUseCase = exports.UpdateClientUseCase = exports.CreateClientUseCase = exports.GetClientByIdUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
const index_1 = require("../../domain/value-objects/index");
// ─── Auth Use Cases ──────────────────────────────────────────────────────────
class LoginUseCase {
    userRepo;
    authService;
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(data) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user || !user.isActive)
            throw new AppError_1.UnauthorizedError('Invalid credentials');
        const isValid = await this.authService.comparePasswords(data.password, user.password);
        if (!isValid)
            throw new AppError_1.UnauthorizedError('Invalid credentials');
        const token = this.authService.generateToken({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...safe } = user;
        return { user: safe, token };
    }
}
exports.LoginUseCase = LoginUseCase;
class RegisterUseCase {
    userRepo;
    authService;
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(data) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing)
            throw new AppError_1.ConflictError('Email already registered');
        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = await this.userRepo.create({ ...data, password: hashedPassword });
        const token = this.authService.generateToken({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...safe } = user;
        return { user: safe, token };
    }
}
exports.RegisterUseCase = RegisterUseCase;
class GetProfileUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new AppError_1.NotFoundError('User not found');
        const { password: _, ...safe } = user;
        return safe;
    }
}
exports.GetProfileUseCase = GetProfileUseCase;
class UpdateProfileUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(userId, data) {
        if (data.email) {
            const existing = await this.userRepo.findByEmail(data.email);
            if (existing && existing.id !== userId)
                throw new AppError_1.ConflictError('Email already in use');
        }
        const user = await this.userRepo.update(userId, data);
        const { password: _, ...safe } = user;
        return safe;
    }
}
exports.UpdateProfileUseCase = UpdateProfileUseCase;
// ─── Table Use Cases ─────────────────────────────────────────────────────────
class GetAllTablesUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute() { return this.tableRepo.findAll(); }
}
exports.GetAllTablesUseCase = GetAllTablesUseCase;
class GetTableByIdUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute(id) {
        const table = await this.tableRepo.findById(id);
        if (!table)
            throw new AppError_1.NotFoundError('Table not found');
        return table;
    }
}
exports.GetTableByIdUseCase = GetTableByIdUseCase;
class CreateTableUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute(data) {
        const existing = await this.tableRepo.findByNumber(data.number);
        if (existing)
            throw new AppError_1.ConflictError('Table number already exists');
        return this.tableRepo.create(data);
    }
}
exports.CreateTableUseCase = CreateTableUseCase;
class UpdateTableUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute(id, data) {
        await this.getTableOrThrow(id);
        if (data.number) {
            const existing = await this.tableRepo.findByNumber(data.number);
            if (existing && existing.id !== id)
                throw new AppError_1.ConflictError('Table number already exists');
        }
        return this.tableRepo.update(id, data);
    }
    async getTableOrThrow(id) {
        const table = await this.tableRepo.findById(id);
        if (!table)
            throw new AppError_1.NotFoundError('Table not found');
        return table;
    }
}
exports.UpdateTableUseCase = UpdateTableUseCase;
class DeleteTableUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute(id) {
        await this.tableRepo.findById(id).then(t => { if (!t)
            throw new AppError_1.NotFoundError('Table not found'); });
        return this.tableRepo.delete(id);
    }
}
exports.DeleteTableUseCase = DeleteTableUseCase;
class UpdateTableStatusUseCase {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async execute(id, status) {
        await this.tableRepo.findById(id).then(t => { if (!t)
            throw new AppError_1.NotFoundError('Table not found'); });
        return this.tableRepo.updateStatus(id, status);
    }
}
exports.UpdateTableStatusUseCase = UpdateTableStatusUseCase;
// ─── Product Use Cases ───────────────────────────────────────────────────────
class GetAllProductsUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(includeInactive) { return this.productRepo.findAll(includeInactive); }
}
exports.GetAllProductsUseCase = GetAllProductsUseCase;
class GetProductByIdUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(id) {
        const p = await this.productRepo.findById(id);
        if (!p)
            throw new AppError_1.NotFoundError('Product not found');
        return p;
    }
}
exports.GetProductByIdUseCase = GetProductByIdUseCase;
class GetProductsByCategoryUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(categoryId) { return this.productRepo.findByCategory(categoryId); }
}
exports.GetProductsByCategoryUseCase = GetProductsByCategoryUseCase;
class CreateProductUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(data) { return this.productRepo.create(data); }
}
exports.CreateProductUseCase = CreateProductUseCase;
class UpdateProductUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(id, data) {
        await this.productRepo.findById(id).then(p => { if (!p)
            throw new AppError_1.NotFoundError('Product not found'); });
        return this.productRepo.update(id, data);
    }
}
exports.UpdateProductUseCase = UpdateProductUseCase;
class DeleteProductUseCase {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(id) {
        await this.productRepo.findById(id).then(p => { if (!p)
            throw new AppError_1.NotFoundError('Product not found'); });
        return this.productRepo.delete(id);
    }
}
exports.DeleteProductUseCase = DeleteProductUseCase;
// ─── Category Use Cases ──────────────────────────────────────────────────────
class GetAllCategoriesUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(includeInactive) { return this.categoryRepo.findAll(includeInactive); }
}
exports.GetAllCategoriesUseCase = GetAllCategoriesUseCase;
class GetCategoryByIdUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(id) {
        const cat = await this.categoryRepo.findById(id);
        if (!cat)
            throw new AppError_1.NotFoundError('Category not found');
        return cat;
    }
}
exports.GetCategoryByIdUseCase = GetCategoryByIdUseCase;
class CreateCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(data) {
        const existing = await this.categoryRepo.findByName(data.name);
        if (existing)
            throw new AppError_1.ConflictError('Category name already exists');
        return this.categoryRepo.create(data);
    }
}
exports.CreateCategoryUseCase = CreateCategoryUseCase;
class UpdateCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(id, data) {
        await this.categoryRepo.findById(id).then(c => { if (!c)
            throw new AppError_1.NotFoundError('Category not found'); });
        if (data.name) {
            const existing = await this.categoryRepo.findByName(data.name);
            if (existing && existing.id !== id)
                throw new AppError_1.ConflictError('Category name already exists');
        }
        return this.categoryRepo.update(id, data);
    }
}
exports.UpdateCategoryUseCase = UpdateCategoryUseCase;
class DeleteCategoryUseCase {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(id) {
        await this.categoryRepo.findById(id).then(c => { if (!c)
            throw new AppError_1.NotFoundError('Category not found'); });
        return this.categoryRepo.delete(id);
    }
}
exports.DeleteCategoryUseCase = DeleteCategoryUseCase;
// ─── Account Use Cases ───────────────────────────────────────────────────────
class GetAllAccountsUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(includeInactive) { return this.accountRepo.findAll(includeInactive); }
}
exports.GetAllAccountsUseCase = GetAllAccountsUseCase;
class GetAccountByIdUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(id) {
        const acc = await this.accountRepo.findById(id);
        if (!acc)
            throw new AppError_1.NotFoundError('Account not found');
        return acc;
    }
}
exports.GetAccountByIdUseCase = GetAccountByIdUseCase;
class GetAccountsByTypeUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(type) { return this.accountRepo.findByType(type); }
}
exports.GetAccountsByTypeUseCase = GetAccountsByTypeUseCase;
class CreateAccountUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(data) {
        const existing = await this.accountRepo.findByName(data.name);
        if (existing)
            throw new AppError_1.ConflictError('Account name already exists');
        return this.accountRepo.create(data);
    }
}
exports.CreateAccountUseCase = CreateAccountUseCase;
class UpdateAccountUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(id, data) {
        await this.accountRepo.findById(id).then(a => { if (!a)
            throw new AppError_1.NotFoundError('Account not found'); });
        if (data.name) {
            const existing = await this.accountRepo.findByName(data.name);
            if (existing && existing.id !== id)
                throw new AppError_1.ConflictError('Account name already exists');
        }
        return this.accountRepo.update(id, data);
    }
}
exports.UpdateAccountUseCase = UpdateAccountUseCase;
class DeleteAccountUseCase {
    accountRepo;
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async execute(id) {
        await this.accountRepo.findById(id).then(a => { if (!a)
            throw new AppError_1.NotFoundError('Account not found'); });
        return this.accountRepo.delete(id);
    }
}
exports.DeleteAccountUseCase = DeleteAccountUseCase;
// ─── Payment Method Use Cases ────────────────────────────────────────────────
class GetAllPaymentMethodsUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(includeInactive) { return this.pmRepo.findAll(includeInactive); }
}
exports.GetAllPaymentMethodsUseCase = GetAllPaymentMethodsUseCase;
class GetPaymentMethodByIdUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(id) {
        const pm = await this.pmRepo.findById(id);
        if (!pm)
            throw new AppError_1.NotFoundError('Payment method not found');
        return pm;
    }
}
exports.GetPaymentMethodByIdUseCase = GetPaymentMethodByIdUseCase;
class GetPaymentMethodsByAccountUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(accountId) { return this.pmRepo.findByAccount(accountId); }
}
exports.GetPaymentMethodsByAccountUseCase = GetPaymentMethodsByAccountUseCase;
class CreatePaymentMethodUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(data) {
        const existing = await this.pmRepo.findByName(data.name);
        if (existing)
            throw new AppError_1.ConflictError('Payment method name already exists');
        return this.pmRepo.create(data);
    }
}
exports.CreatePaymentMethodUseCase = CreatePaymentMethodUseCase;
class UpdatePaymentMethodUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(id, data) {
        await this.pmRepo.findById(id).then(p => { if (!p)
            throw new AppError_1.NotFoundError('Payment method not found'); });
        if (data.name) {
            const existing = await this.pmRepo.findByName(data.name);
            if (existing && existing.id !== id)
                throw new AppError_1.ConflictError('Payment method name already exists');
        }
        return this.pmRepo.update(id, data);
    }
}
exports.UpdatePaymentMethodUseCase = UpdatePaymentMethodUseCase;
class DeletePaymentMethodUseCase {
    pmRepo;
    constructor(pmRepo) {
        this.pmRepo = pmRepo;
    }
    async execute(id) {
        await this.pmRepo.findById(id).then(p => { if (!p)
            throw new AppError_1.NotFoundError('Payment method not found'); });
        return this.pmRepo.delete(id);
    }
}
exports.DeletePaymentMethodUseCase = DeletePaymentMethodUseCase;
// ─── Order Use Cases ─────────────────────────────────────────────────────────
class CreateOrderUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(data) {
        return this.orderRepo.create(data);
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
class GetOrderByIdUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(id) {
        const order = await this.orderRepo.findByIdWithItems(id);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        return order;
    }
}
exports.GetOrderByIdUseCase = GetOrderByIdUseCase;
class GetAllOrdersUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(filters) { return this.orderRepo.findAll(filters); }
}
exports.GetAllOrdersUseCase = GetAllOrdersUseCase;
class AddItemToOrderUseCase {
    orderRepo;
    productRepo;
    constructor(orderRepo, productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }
    async execute(data) {
        const order = await this.orderRepo.findById(data.orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        const product = await this.productRepo.findById(data.productId);
        if (!product || !product.isActive)
            throw new AppError_1.NotFoundError('Product not found');
        const unitPrice = product.price;
        const subtotal = Math.round(unitPrice * data.quantity * 100) / 100;
        const item = await this.orderRepo.addItem({
            orderId: data.orderId,
            productId: data.productId,
            quantity: data.quantity,
            unitPrice,
            subtotal,
            notes: data.notes,
        });
        await this.recalculateOrder(data.orderId);
        return item;
    }
    async recalculateOrder(orderId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order)
            return;
        const orderItems = await this.orderRepo.findByIdWithItems(orderId);
        if (!orderItems)
            return;
        const subtotal = orderItems.items.reduce((sum, i) => sum + i.subtotal, 0);
        const rounded = Math.round(subtotal * 100) / 100;
        const tax = Math.round(rounded * 0.19 * 100) / 100;
        const total = Math.round((rounded + tax - order.discount) * 100) / 100;
        await this.orderRepo.update(orderId, { subtotal: rounded, tax, total });
    }
}
exports.AddItemToOrderUseCase = AddItemToOrderUseCase;
class UpdateOrderItemUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(id, data) {
        const item = await this.orderRepo.findOrderItem(id);
        if (!item)
            throw new AppError_1.NotFoundError('Order item not found');
        const quantity = data.quantity ?? item.quantity;
        const unitPrice = item.unitPrice;
        const subtotal = Math.round(unitPrice * quantity * 100) / 100;
        const updated = await this.orderRepo.updateItem(id, { ...data, subtotal, unitPrice });
        const orderItems = await this.orderRepo.findByIdWithItems(item.orderId);
        if (orderItems) {
            const subtotalSum = orderItems.items.reduce((sum, i) => sum + (i.id === id ? subtotal : i.subtotal), 0);
            const rounded = Math.round(subtotalSum * 100) / 100;
            const tax = Math.round(rounded * 0.19 * 100) / 100;
            const total = Math.round((rounded + tax - orderItems.discount) * 100) / 100;
            await this.orderRepo.update(item.orderId, { subtotal: rounded, tax, total });
        }
        return updated;
    }
}
exports.UpdateOrderItemUseCase = UpdateOrderItemUseCase;
class RemoveOrderItemUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(id) {
        const item = await this.orderRepo.findOrderItem(id);
        if (!item)
            throw new AppError_1.NotFoundError('Order item not found');
        await this.orderRepo.removeItem(id);
        const orderItems = await this.orderRepo.findByIdWithItems(item.orderId);
        if (orderItems) {
            const subtotal = orderItems.items.reduce((sum, i) => sum + (i.id === id ? 0 : i.subtotal), 0);
            const rounded = Math.round(subtotal * 100) / 100;
            const tax = Math.round(rounded * 0.19 * 100) / 100;
            const total = Math.round((rounded + tax - orderItems.discount) * 100) / 100;
            await this.orderRepo.update(item.orderId, { subtotal: rounded, tax, total });
        }
    }
}
exports.RemoveOrderItemUseCase = RemoveOrderItemUseCase;
class ChangeTableUseCase {
    orderRepo;
    tableRepo;
    constructor(orderRepo, tableRepo) {
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
    }
    async execute(orderId, tableId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        const table = await this.tableRepo.findById(tableId);
        if (!table)
            throw new AppError_1.NotFoundError('Table not found');
        return this.orderRepo.update(orderId, { tableId });
    }
}
exports.ChangeTableUseCase = ChangeTableUseCase;
class SplitOrderUseCase {
    orderRepo;
    tableRepo;
    constructor(orderRepo, tableRepo) {
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
    }
    async execute(orderId, data) {
        const sourceOrder = await this.orderRepo.findByIdWithItems(orderId);
        if (!sourceOrder)
            throw new AppError_1.NotFoundError('Order not found');
        if (data.tableId) {
            const table = await this.tableRepo.findById(data.tableId);
            if (!table)
                throw new AppError_1.NotFoundError('Table not found');
        }
        const newOrder = await this.orderRepo.create({
            tableId: data.tableId,
            userId: sourceOrder.userId,
            clientId: sourceOrder.clientId ?? undefined,
        });
        for (const splitItem of data.items) {
            const sourceItem = sourceOrder.items.find((i) => i.id === splitItem.itemId);
            if (!sourceItem)
                throw new AppError_1.NotFoundError(`Item ${splitItem.itemId} not found`);
            if (splitItem.quantity > sourceItem.quantity)
                throw new AppError_1.ValidationError(`Insufficient quantity for item ${sourceItem.product.name}`);
            const unitPrice = sourceItem.unitPrice;
            const subtotal = Math.round(unitPrice * splitItem.quantity * 100) / 100;
            await this.orderRepo.addItem({
                orderId: newOrder.id,
                productId: sourceItem.productId,
                quantity: splitItem.quantity,
                unitPrice,
                subtotal,
            });
            const remainingQty = sourceItem.quantity - splitItem.quantity;
            if (remainingQty <= 0) {
                await this.orderRepo.removeItem(sourceItem.id);
            }
            else {
                const remainingSubtotal = Math.round(unitPrice * remainingQty * 100) / 100;
                await this.orderRepo.updateItem(sourceItem.id, { quantity: remainingQty, subtotal: remainingSubtotal });
            }
        }
        const recalcOrder = async (oid) => {
            const full = await this.orderRepo.findByIdWithItems(oid);
            if (!full)
                return;
            const subtotal = full.items.reduce((sum, i) => sum + i.subtotal, 0);
            const rounded = Math.round(subtotal * 100) / 100;
            const tax = Math.round(rounded * 0.19 * 100) / 100;
            const total = Math.round((rounded + tax) * 100) / 100;
            await this.orderRepo.update(oid, { subtotal: rounded, tax, total });
        };
        await recalcOrder(orderId);
        await recalcOrder(newOrder.id);
        return this.orderRepo.findByIdWithItems(newOrder.id);
    }
}
exports.SplitOrderUseCase = SplitOrderUseCase;
class GetOrderHistoryUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(orderId) { return this.orderRepo.getHistory(orderId); }
}
exports.GetOrderHistoryUseCase = GetOrderHistoryUseCase;
// ─── Payment Use Cases ───────────────────────────────────────────────────────
class ProcessPaymentUseCase {
    paymentRepo;
    orderRepo;
    constructor(paymentRepo, orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }
    async execute(data) {
        const order = await this.orderRepo.findById(data.orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        const payment = await this.paymentRepo.create(data);
        const payments = await this.paymentRepo.findByOrder(data.orderId);
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= order.total) {
            await this.orderRepo.update(data.orderId, { status: index_1.OrderStatus.COMPLETED, closedAt: new Date() });
        }
        return payment;
    }
}
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
class GetPaymentsByOrderUseCase {
    paymentRepo;
    constructor(paymentRepo) {
        this.paymentRepo = paymentRepo;
    }
    async execute(orderId) { return this.paymentRepo.findByOrder(orderId); }
}
exports.GetPaymentsByOrderUseCase = GetPaymentsByOrderUseCase;
// ─── Cash Register Use Cases ─────────────────────────────────────────────────
class OpenCashRegisterUseCase {
    cashRegisterRepo;
    constructor(cashRegisterRepo) {
        this.cashRegisterRepo = cashRegisterRepo;
    }
    async execute(data) {
        const existing = await this.cashRegisterRepo.findOpenRegister();
        if (existing)
            throw new AppError_1.ConflictError('There is already an open cash register');
        return this.cashRegisterRepo.create(data);
    }
}
exports.OpenCashRegisterUseCase = OpenCashRegisterUseCase;
class CloseCashRegisterUseCase {
    cashRegisterRepo;
    constructor(cashRegisterRepo) {
        this.cashRegisterRepo = cashRegisterRepo;
    }
    async execute(id, data) {
        const reg = await this.cashRegisterRepo.findById(id);
        if (!reg)
            throw new AppError_1.NotFoundError('Cash register not found');
        if (reg.status !== 'OPEN')
            throw new AppError_1.ValidationError('Cash register is not open');
        return this.cashRegisterRepo.closeRegister(id, data);
    }
}
exports.CloseCashRegisterUseCase = CloseCashRegisterUseCase;
class GetCurrentCashRegisterUseCase {
    cashRegisterRepo;
    constructor(cashRegisterRepo) {
        this.cashRegisterRepo = cashRegisterRepo;
    }
    async execute() { return this.cashRegisterRepo.findOpenRegister(); }
}
exports.GetCurrentCashRegisterUseCase = GetCurrentCashRegisterUseCase;
class GetCashRegisterMovementsUseCase {
    cashRegisterRepo;
    constructor(cashRegisterRepo) {
        this.cashRegisterRepo = cashRegisterRepo;
    }
    async execute(cashRegisterId) {
        const reg = await this.cashRegisterRepo.findById(cashRegisterId);
        if (!reg)
            throw new AppError_1.NotFoundError('Cash register not found');
        return this.cashRegisterRepo.findMovementsByRegister(cashRegisterId);
    }
}
exports.GetCashRegisterMovementsUseCase = GetCashRegisterMovementsUseCase;
class GetCashRegisterSummaryUseCase {
    cashRegisterRepo;
    accountRepo;
    constructor(cashRegisterRepo, accountRepo) {
        this.cashRegisterRepo = cashRegisterRepo;
        this.accountRepo = accountRepo;
    }
    async execute(cashRegisterId) {
        const reg = await this.cashRegisterRepo.findById(cashRegisterId);
        if (!reg)
            throw new AppError_1.NotFoundError('Cash register not found');
        const movements = await this.cashRegisterRepo.findMovementsByRegister(cashRegisterId);
        const accounts = await this.accountRepo.findAll();
        const accountMap = new Map(accounts.map(a => [a.id, a.name]));
        const grouped = {};
        let totalIncome = 0;
        let totalOutcome = 0;
        for (const m of movements) {
            if (!grouped[m.accountId]) {
                grouped[m.accountId] = {
                    accountId: m.accountId,
                    accountName: accountMap.get(m.accountId) || 'Unknown',
                    totalAmount: 0,
                    movements: [],
                };
            }
            grouped[m.accountId].movements.push(m);
            grouped[m.accountId].totalAmount += m.amount;
            if (m.type === 'INCOME')
                totalIncome += m.amount;
            else
                totalOutcome += m.amount;
        }
        return {
            cashRegisterId: reg.id,
            date: reg.date,
            initialAmount: reg.initialAmount,
            finalAmount: reg.finalAmount,
            status: reg.status,
            totalIncome,
            totalOutcome,
            movementsByAccount: Object.values(grouped),
        };
    }
}
exports.GetCashRegisterSummaryUseCase = GetCashRegisterSummaryUseCase;
// ─── Client Use Cases ────────────────────────────────────────────────────────
class GetAllClientsUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute() { return this.clientRepo.findAll(); }
}
exports.GetAllClientsUseCase = GetAllClientsUseCase;
class GetClientByIdUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute(id) {
        const client = await this.clientRepo.findById(id);
        if (!client)
            throw new AppError_1.NotFoundError('Client not found');
        return client;
    }
}
exports.GetClientByIdUseCase = GetClientByIdUseCase;
class CreateClientUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute(data) {
        if (data.document) {
            const existing = await this.clientRepo.findByDocument(data.document);
            if (existing)
                throw new AppError_1.ConflictError('Client with this document already exists');
        }
        return this.clientRepo.create(data);
    }
}
exports.CreateClientUseCase = CreateClientUseCase;
class UpdateClientUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute(id, data) {
        await this.clientRepo.findById(id).then(c => { if (!c)
            throw new AppError_1.NotFoundError('Client not found'); });
        return this.clientRepo.update(id, data);
    }
}
exports.UpdateClientUseCase = UpdateClientUseCase;
class DeleteClientUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute(id) {
        await this.clientRepo.findById(id).then(c => { if (!c)
            throw new AppError_1.NotFoundError('Client not found'); });
        return this.clientRepo.delete(id);
    }
}
exports.DeleteClientUseCase = DeleteClientUseCase;
class GetClientHistoryUseCase {
    clientRepo;
    constructor(clientRepo) {
        this.clientRepo = clientRepo;
    }
    async execute(clientId) { return this.clientRepo.getHistory(clientId); }
}
exports.GetClientHistoryUseCase = GetClientHistoryUseCase;
// ─── Collection Use Cases ────────────────────────────────────────────────────
class GetAllCollectionsUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute(filters) { return this.collectionRepo.findAll(filters); }
}
exports.GetAllCollectionsUseCase = GetAllCollectionsUseCase;
class GetCollectionByIdUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute(id) {
        const col = await this.collectionRepo.findById(id);
        if (!col)
            throw new AppError_1.NotFoundError('Collection account not found');
        return col;
    }
}
exports.GetCollectionByIdUseCase = GetCollectionByIdUseCase;
class CreateCollectionUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute(data) {
        return this.collectionRepo.create(data);
    }
}
exports.CreateCollectionUseCase = CreateCollectionUseCase;
class RegisterCollectionPaymentUseCase {
    collectionPaymentRepo;
    collectionRepo;
    constructor(collectionPaymentRepo, collectionRepo) {
        this.collectionPaymentRepo = collectionPaymentRepo;
        this.collectionRepo = collectionRepo;
    }
    async execute(data) {
        const account = await this.collectionRepo.findById(data.collectionAccountId);
        if (!account)
            throw new AppError_1.NotFoundError('Collection account not found');
        const payment = await this.collectionPaymentRepo.create(data);
        const payments = await this.collectionPaymentRepo.findByCollectionAccount(data.collectionAccountId);
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const status = totalPaid >= account.totalAmount ? 'PAID' : 'PARTIALLY_PAID';
        await this.collectionRepo.update(data.collectionAccountId, { paidAmount: totalPaid, status });
        return payment;
    }
}
exports.RegisterCollectionPaymentUseCase = RegisterCollectionPaymentUseCase;
class GetCollectionHistoryUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute(collectionId) {
        return this.collectionRepo.findWithPayments(collectionId);
    }
}
exports.GetCollectionHistoryUseCase = GetCollectionHistoryUseCase;
// ─── User Use Cases ──────────────────────────────────────────────────────────
class GetAllUsersUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute() { return this.userRepo.findAll(); }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
class GetUserByIdUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(id) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new AppError_1.NotFoundError('User not found');
        const { password: _, ...safe } = user;
        return safe;
    }
}
exports.GetUserByIdUseCase = GetUserByIdUseCase;
class CreateUserUseCase {
    userRepo;
    authService;
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(data) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing)
            throw new AppError_1.ConflictError('Email already registered');
        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = await this.userRepo.create({ ...data, password: hashedPassword });
        const { password: _, ...safe } = user;
        return safe;
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
class UpdateUserUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(id, data) {
        await this.userRepo.findById(id).then(u => { if (!u)
            throw new AppError_1.NotFoundError('User not found'); });
        if (data.email) {
            const existing = await this.userRepo.findByEmail(data.email);
            if (existing && existing.id !== id)
                throw new AppError_1.ConflictError('Email already in use');
        }
        const user = await this.userRepo.update(id, data);
        const { password: _, ...safe } = user;
        return safe;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
class DeleteUserUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(id) {
        await this.userRepo.findById(id).then(u => { if (!u)
            throw new AppError_1.NotFoundError('User not found'); });
        return this.userRepo.delete(id);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
// ─── Report Use Cases ────────────────────────────────────────────────────────
class SalesByDayUseCase {
    orderRepo;
    paymentRepo;
    constructor(orderRepo, paymentRepo) {
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const grouped = {};
        for (const order of completedOrders) {
            const day = order.createdAt.toISOString().slice(0, 10);
            if (!grouped[day])
                grouped[day] = { count: 0, total: 0, orders: [] };
            grouped[day].count++;
            grouped[day].total += order.total;
            grouped[day].orders.push(order.id);
        }
        return Object.entries(grouped).map(([date, data]) => ({ date, ...data }));
    }
}
exports.SalesByDayUseCase = SalesByDayUseCase;
class SalesByMonthUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const grouped = {};
        for (const order of completedOrders) {
            const month = order.createdAt.toISOString().slice(0, 7);
            if (!grouped[month])
                grouped[month] = { count: 0, total: 0 };
            grouped[month].count++;
            grouped[month].total += order.total;
        }
        return Object.entries(grouped).map(([month, data]) => ({ month, ...data }));
    }
}
exports.SalesByMonthUseCase = SalesByMonthUseCase;
class SalesByProductUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const productSales = {};
        for (const order of completedOrders) {
            const full = await this.orderRepo.findByIdWithItems(order.id);
            if (!full)
                continue;
            for (const item of full.items) {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.product.name, quantity: 0, total: 0, categoryId: item.product.categoryId };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].total += item.subtotal;
            }
        }
        return Object.entries(productSales).map(([productId, data]) => ({ productId, ...data }));
    }
}
exports.SalesByProductUseCase = SalesByProductUseCase;
class SalesByCategoryUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const categorySales = {};
        for (const order of completedOrders) {
            const full = await this.orderRepo.findByIdWithItems(order.id);
            if (!full)
                continue;
            for (const item of full.items) {
                const cat = item.product.categoryId;
                if (!categorySales[cat])
                    categorySales[cat] = { quantity: 0, total: 0 };
                categorySales[cat].quantity += item.quantity;
                categorySales[cat].total += item.subtotal;
            }
        }
        return Object.entries(categorySales).map(([categoryId, data]) => ({ categoryId, ...data }));
    }
}
exports.SalesByCategoryUseCase = SalesByCategoryUseCase;
class SalesByUserUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const userSales = {};
        for (const order of completedOrders) {
            if (!userSales[order.userId])
                userSales[order.userId] = { count: 0, total: 0 };
            userSales[order.userId].count++;
            userSales[order.userId].total += order.total;
        }
        return Object.entries(userSales).map(([userId, data]) => ({ userId, ...data }));
    }
}
exports.SalesByUserUseCase = SalesByUserUseCase;
class TopProductsUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(limit = 10, startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(0);
        const orders = await this.orderRepo.findByDateRange(start, end);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const productSales = {};
        for (const order of completedOrders) {
            const full = await this.orderRepo.findByIdWithItems(order.id);
            if (!full)
                continue;
            for (const item of full.items) {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { productId: item.productId, name: item.product.name, quantity: 0, total: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].total += item.subtotal;
            }
        }
        return Object.values(productSales)
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    }
}
exports.TopProductsUseCase = TopProductsUseCase;
class PaymentMethodsUseCase {
    paymentRepo;
    constructor(paymentRepo) {
        this.paymentRepo = paymentRepo;
    }
    async execute(startDate, endDate) {
        const end = endDate || new Date();
        const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const payments = await this.paymentRepo.findByDateRange(start, end);
        const grouped = {};
        for (const payment of payments) {
            if (!grouped[payment.paymentMethodId])
                grouped[payment.paymentMethodId] = { count: 0, total: 0 };
            grouped[payment.paymentMethodId].count++;
            grouped[payment.paymentMethodId].total += payment.amount;
        }
        return Object.entries(grouped).map(([paymentMethodId, data]) => ({ paymentMethodId, ...data }));
    }
}
exports.PaymentMethodsUseCase = PaymentMethodsUseCase;
class CollectionsReportUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute() {
        const collections = await this.collectionRepo.findAll();
        return collections;
    }
}
exports.CollectionsReportUseCase = CollectionsReportUseCase;
class ClientsWithDebtUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute() {
        const collections = await this.collectionRepo.findAll({ status: 'PENDING' });
        const pending = collections.filter(c => c.status === 'PENDING' || c.status === 'PARTIALLY_PAID');
        const clientDebts = {};
        for (const col of pending) {
            if (!clientDebts[col.clientId]) {
                clientDebts[col.clientId] = { clientId: col.clientId, totalDebt: 0, totalPaid: 0, balance: 0 };
            }
            clientDebts[col.clientId].totalDebt += col.totalAmount;
            clientDebts[col.clientId].totalPaid += col.paidAmount;
            clientDebts[col.clientId].balance += (col.totalAmount - col.paidAmount);
        }
        return Object.values(clientDebts);
    }
}
exports.ClientsWithDebtUseCase = ClientsWithDebtUseCase;
// ─── Print Use Cases ─────────────────────────────────────────────────────────
class PrintOrderUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(orderId) {
        const order = await this.orderRepo.findByIdWithItems(orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        return order;
    }
}
exports.PrintOrderUseCase = PrintOrderUseCase;
class PrintPreBillUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(orderId) {
        const order = await this.orderRepo.findByIdWithItems(orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        return order;
    }
}
exports.PrintPreBillUseCase = PrintPreBillUseCase;
class PrintInvoiceUseCase {
    orderRepo;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async execute(orderId) {
        const order = await this.orderRepo.findByIdWithItems(orderId);
        if (!order)
            throw new AppError_1.NotFoundError('Order not found');
        return order;
    }
}
exports.PrintInvoiceUseCase = PrintInvoiceUseCase;
class PrintCollectionAccountUseCase {
    collectionRepo;
    constructor(collectionRepo) {
        this.collectionRepo = collectionRepo;
    }
    async execute(collectionId) {
        const account = await this.collectionRepo.findById(collectionId);
        if (!account)
            throw new AppError_1.NotFoundError('Collection account not found');
        return account;
    }
}
exports.PrintCollectionAccountUseCase = PrintCollectionAccountUseCase;
//# sourceMappingURL=index.js.map