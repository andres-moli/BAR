"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCashRegisterRepository = exports.PrismaCollectionPaymentRepository = exports.PrismaCollectionAccountRepository = exports.PrismaClientRepository = exports.PrismaPaymentRepository = exports.PrismaOrderRepository = exports.PrismaProductRepository = exports.PrismaPaymentMethodRepository = exports.PrismaAccountRepository = exports.PrismaCategoryRepository = exports.PrismaTableRepository = exports.PrismaUserRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const toNumber = (value) => {
    if (value == null)
        return 0;
    return Number(value);
};
const mapUser = (u) => ({
    id: u.id, email: u.email, password: u.password, name: u.name,
    role: u.role, isActive: u.isActive, createdAt: u.createdAt, updatedAt: u.updatedAt,
});
const mapSafeUser = (u) => {
    const { password, ...safe } = mapUser(u);
    return safe;
};
const mapTable = (t) => ({
    id: t.id, number: t.number, status: t.status, capacity: t.capacity,
    location: t.location, createdAt: t.createdAt, updatedAt: t.updatedAt,
});
const mapCategory = (c) => ({
    id: c.id, name: c.name, description: c.description, icon: c.icon,
    isActive: c.isActive, createdAt: c.createdAt, updatedAt: c.updatedAt,
});
const mapProduct = (p) => ({
    id: p.id, name: p.name, description: p.description, price: toNumber(p.price),
    cost: toNumber(p.cost), categoryId: p.categoryId, isActive: p.isActive, stock: p.stock,
    imageUrl: p.imageUrl, createdAt: p.createdAt, updatedAt: p.updatedAt,
});
const mapOrder = (o) => ({
    id: o.id, status: o.status, notes: o.notes, subtotal: toNumber(o.subtotal),
    tax: toNumber(o.tax), total: toNumber(o.total), discount: toNumber(o.discount),
    tableId: o.tableId, userId: o.userId, clientId: o.clientId,
    createdAt: o.createdAt, updatedAt: o.updatedAt, closedAt: o.closedAt,
});
const mapOrderItem = (i) => ({
    id: i.id, quantity: i.quantity, unitPrice: toNumber(i.unitPrice),
    subtotal: toNumber(i.subtotal), notes: i.notes, orderId: i.orderId,
    productId: i.productId, createdAt: i.createdAt, updatedAt: i.updatedAt,
});
const mapPayment = (p) => ({
    id: p.id, amount: toNumber(p.amount), paymentMethodId: p.paymentMethodId,
    reference: p.reference, orderId: p.orderId, userId: p.userId,
    createdAt: p.createdAt, updatedAt: p.updatedAt,
});
const mapClient = (c) => ({
    id: c.id, name: c.name, email: c.email, phone: c.phone,
    document: c.document, address: c.address, createdAt: c.createdAt, updatedAt: c.updatedAt,
});
const mapCollectionAccount = (c) => ({
    id: c.id, totalAmount: toNumber(c.totalAmount), paidAmount: toNumber(c.paidAmount),
    status: c.status, notes: c.notes, clientId: c.clientId,
    createdAt: c.createdAt, updatedAt: c.updatedAt, dueDate: c.dueDate,
});
const mapCollectionPayment = (p) => ({
    id: p.id, amount: toNumber(p.amount), paymentMethodId: p.paymentMethodId,
    reference: p.reference, collectionAccountId: p.collectionAccountId,
    createdAt: p.createdAt, updatedAt: p.updatedAt,
});
const mapAccount = (a) => ({
    id: a.id, name: a.name, type: a.type, isActive: a.isActive,
    createdAt: a.createdAt, updatedAt: a.updatedAt,
});
const mapPaymentMethod = (p) => ({
    id: p.id, name: p.name, accountId: p.accountId, isActive: p.isActive,
    createdAt: p.createdAt, updatedAt: p.updatedAt,
});
const mapCashRegister = (r) => ({
    id: r.id, date: r.date, initialAmount: toNumber(r.initialAmount),
    finalAmount: r.finalAmount ? toNumber(r.finalAmount) : null,
    status: r.status, openedBy: r.openedBy, closedBy: r.closedBy,
    openedAt: r.openedAt, closedAt: r.closedAt, notes: r.notes,
});
const mapCashMovement = (m) => ({
    id: m.id, cashRegisterId: m.cashRegisterId, accountId: m.accountId,
    amount: toNumber(m.amount), type: m.type, description: m.description,
    reference: m.reference, paymentId: m.paymentId, createdAt: m.createdAt,
});
// ─── User Repository ──────────────────────────────────────────────────────────
class PrismaUserRepository {
    async findAll() {
        const users = await prisma_1.default.user.findMany({ orderBy: { createdAt: 'desc' } });
        return users.map(mapUser);
    }
    async findById(id) {
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        return user ? mapUser(user) : null;
    }
    async findByEmail(email) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        return user ? mapUser(user) : null;
    }
    async create(data) {
        const user = await prisma_1.default.user.create({
            data: { email: data.email, password: data.password, name: data.name, role: data.role },
        });
        return mapUser(user);
    }
    async update(id, data) {
        const user = await prisma_1.default.user.update({ where: { id }, data: data });
        return mapUser(user);
    }
    async delete(id) {
        await prisma_1.default.user.update({ where: { id }, data: { isActive: false } });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
// ─── Table Repository ─────────────────────────────────────────────────────────
class PrismaTableRepository {
    async findAll() {
        const tables = await prisma_1.default.table.findMany({ orderBy: { number: 'asc' } });
        return tables.map(mapTable);
    }
    async findById(id) {
        const table = await prisma_1.default.table.findUnique({ where: { id } });
        return table ? mapTable(table) : null;
    }
    async findByNumber(number) {
        const table = await prisma_1.default.table.findUnique({ where: { number } });
        return table ? mapTable(table) : null;
    }
    async findByStatus(status) {
        const tables = await prisma_1.default.table.findMany({ where: { status }, orderBy: { number: 'asc' } });
        return tables.map(mapTable);
    }
    async create(data) {
        const table = await prisma_1.default.table.create({ data: data });
        return mapTable(table);
    }
    async update(id, data) {
        const table = await prisma_1.default.table.update({ where: { id }, data: data });
        return mapTable(table);
    }
    async delete(id) {
        await prisma_1.default.table.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        const table = await prisma_1.default.table.update({ where: { id }, data: { status } });
        return mapTable(table);
    }
}
exports.PrismaTableRepository = PrismaTableRepository;
// ─── Category Repository ──────────────────────────────────────────────────────
class PrismaCategoryRepository {
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const categories = await prisma_1.default.category.findMany({ where, orderBy: { name: 'asc' } });
        return categories.map(mapCategory);
    }
    async findById(id) {
        const cat = await prisma_1.default.category.findUnique({ where: { id } });
        return cat ? mapCategory(cat) : null;
    }
    async findByName(name) {
        const cat = await prisma_1.default.category.findUnique({ where: { name } });
        return cat ? mapCategory(cat) : null;
    }
    async create(data) {
        const cat = await prisma_1.default.category.create({ data: data });
        return mapCategory(cat);
    }
    async update(id, data) {
        const cat = await prisma_1.default.category.update({ where: { id }, data: data });
        return mapCategory(cat);
    }
    async delete(id) {
        await prisma_1.default.category.delete({ where: { id } });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
// ─── Account Repository ───────────────────────────────────────────────────────
class PrismaAccountRepository {
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const accounts = await prisma_1.default.account.findMany({ where, orderBy: { name: 'asc' } });
        return accounts.map(mapAccount);
    }
    async findById(id) {
        const acc = await prisma_1.default.account.findUnique({ where: { id } });
        return acc ? mapAccount(acc) : null;
    }
    async findByName(name) {
        const acc = await prisma_1.default.account.findUnique({ where: { name } });
        return acc ? mapAccount(acc) : null;
    }
    async findByType(type) {
        const accounts = await prisma_1.default.account.findMany({ where: { type: type, isActive: true } });
        return accounts.map(mapAccount);
    }
    async create(data) {
        const acc = await prisma_1.default.account.create({ data: data });
        return mapAccount(acc);
    }
    async update(id, data) {
        const acc = await prisma_1.default.account.update({ where: { id }, data: data });
        return mapAccount(acc);
    }
    async delete(id) {
        await prisma_1.default.account.delete({ where: { id } });
    }
}
exports.PrismaAccountRepository = PrismaAccountRepository;
// ─── Payment Method Repository ────────────────────────────────────────────────
class PrismaPaymentMethodRepository {
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const methods = await prisma_1.default.paymentMethod.findMany({ where, orderBy: { name: 'asc' } });
        return methods.map(mapPaymentMethod);
    }
    async findById(id) {
        const pm = await prisma_1.default.paymentMethod.findUnique({ where: { id } });
        return pm ? mapPaymentMethod(pm) : null;
    }
    async findByName(name) {
        const pm = await prisma_1.default.paymentMethod.findUnique({ where: { name } });
        return pm ? mapPaymentMethod(pm) : null;
    }
    async findByAccount(accountId) {
        const methods = await prisma_1.default.paymentMethod.findMany({
            where: { accountId, isActive: true },
            orderBy: { name: 'asc' },
        });
        return methods.map(mapPaymentMethod);
    }
    async create(data) {
        const pm = await prisma_1.default.paymentMethod.create({ data: data });
        return mapPaymentMethod(pm);
    }
    async update(id, data) {
        const pm = await prisma_1.default.paymentMethod.update({ where: { id }, data: data });
        return mapPaymentMethod(pm);
    }
    async delete(id) {
        await prisma_1.default.paymentMethod.delete({ where: { id } });
    }
}
exports.PrismaPaymentMethodRepository = PrismaPaymentMethodRepository;
// ─── Product Repository ───────────────────────────────────────────────────────
class PrismaProductRepository {
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const products = await prisma_1.default.product.findMany({ where, orderBy: { name: 'asc' } });
        return products.map(mapProduct);
    }
    async findById(id) {
        const product = await prisma_1.default.product.findUnique({ where: { id } });
        return product ? mapProduct(product) : null;
    }
    async findByCategory(categoryId) {
        const products = await prisma_1.default.product.findMany({
            where: { categoryId, isActive: true },
            orderBy: { name: 'asc' },
        });
        return products.map(mapProduct);
    }
    async create(data) {
        const product = await prisma_1.default.product.create({ data: data });
        return mapProduct(product);
    }
    async update(id, data) {
        const product = await prisma_1.default.product.update({ where: { id }, data: data });
        return mapProduct(product);
    }
    async delete(id) {
        await prisma_1.default.product.update({ where: { id }, data: { isActive: false } });
    }
}
exports.PrismaProductRepository = PrismaProductRepository;
// ─── Order Repository ─────────────────────────────────────────────────────────
class PrismaOrderRepository {
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.tableId)
            where.tableId = filters.tableId;
        if (filters?.userId)
            where.userId = filters.userId;
        if (filters?.clientId)
            where.clientId = filters.clientId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const orders = await prisma_1.default.order.findMany({ where, orderBy: { createdAt: 'desc' } });
        return orders.map(mapOrder);
    }
    async findById(id) {
        const order = await prisma_1.default.order.findUnique({ where: { id } });
        return order ? mapOrder(order) : null;
    }
    async findByIdWithItems(id) {
        const order = await prisma_1.default.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                table: true,
                user: true,
                client: true,
            },
        });
        if (!order)
            return null;
        return {
            ...mapOrder(order),
            items: order.items.map((i) => ({ ...mapOrderItem(i), product: mapProduct(i.product) })),
            table: order.table ? mapTable(order.table) : null,
            user: mapSafeUser(order.user),
            client: order.client ? mapClient(order.client) : null,
        };
    }
    async findByTable(tableId, status) {
        const where = { tableId };
        if (status)
            where.status = status;
        const orders = await prisma_1.default.order.findMany({ where, orderBy: { createdAt: 'desc' } });
        return orders.map(mapOrder);
    }
    async findByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const orders = await prisma_1.default.order.findMany({ where, orderBy: { createdAt: 'desc' } });
        return orders.map(mapOrder);
    }
    async findByClient(clientId) {
        const orders = await prisma_1.default.order.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' } });
        return orders.map(mapOrder);
    }
    async findByDateRange(startDate, endDate) {
        const orders = await prisma_1.default.order.findMany({
            where: { createdAt: { gte: startDate, lte: endDate } },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map(mapOrder);
    }
    async create(data) {
        const order = await prisma_1.default.order.create({ data: data });
        return mapOrder(order);
    }
    async update(id, data) {
        const order = await prisma_1.default.order.update({ where: { id }, data: data });
        return mapOrder(order);
    }
    async delete(id) {
        await prisma_1.default.order.delete({ where: { id } });
    }
    async addItem(data) {
        const item = await prisma_1.default.orderItem.create({ data: data });
        return mapOrderItem(item);
    }
    async updateItem(id, data) {
        const item = await prisma_1.default.orderItem.update({ where: { id }, data: data });
        return mapOrderItem(item);
    }
    async removeItem(id) {
        await prisma_1.default.orderItem.delete({ where: { id } });
    }
    async findOrderItem(id) {
        const item = await prisma_1.default.orderItem.findUnique({ where: { id }, include: { product: true } });
        if (!item)
            return null;
        return { ...mapOrderItem(item), product: mapProduct(item.product) };
    }
    async getHistory(orderId) {
        const order = await prisma_1.default.order.findUnique({ where: { id: orderId } });
        if (!order)
            return [];
        const where = {};
        if (order.tableId)
            where.tableId = order.tableId;
        if (order.clientId)
            where.clientId = order.clientId;
        where.id = { not: orderId };
        const history = await prisma_1.default.order.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
        return history.map(mapOrder);
    }
}
exports.PrismaOrderRepository = PrismaOrderRepository;
// ─── Payment Repository ───────────────────────────────────────────────────────
class PrismaPaymentRepository {
    async findAll(filters) {
        const where = {};
        if (filters?.paymentMethodId)
            where.paymentMethodId = filters.paymentMethodId;
        if (filters?.userId)
            where.userId = filters.userId;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const payments = await prisma_1.default.payment.findMany({ where, orderBy: { createdAt: 'desc' } });
        return payments.map(mapPayment);
    }
    async findById(id) {
        const payment = await prisma_1.default.payment.findUnique({ where: { id } });
        return payment ? mapPayment(payment) : null;
    }
    async findByOrder(orderId) {
        const payments = await prisma_1.default.payment.findMany({ where: { orderId }, orderBy: { createdAt: 'desc' } });
        return payments.map(mapPayment);
    }
    async create(data) {
        const payment = await prisma_1.default.payment.create({ data: data });
        return mapPayment(payment);
    }
    async findByDateRange(startDate, endDate) {
        const payments = await prisma_1.default.payment.findMany({
            where: { createdAt: { gte: startDate, lte: endDate } },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map(mapPayment);
    }
}
exports.PrismaPaymentRepository = PrismaPaymentRepository;
// ─── Client Repository ────────────────────────────────────────────────────────
class PrismaClientRepository {
    async findAll() {
        const clients = await prisma_1.default.client.findMany({ orderBy: { name: 'asc' } });
        return clients.map(mapClient);
    }
    async findById(id) {
        const client = await prisma_1.default.client.findUnique({ where: { id } });
        return client ? mapClient(client) : null;
    }
    async findByDocument(document) {
        const client = await prisma_1.default.client.findFirst({ where: { document } });
        return client ? mapClient(client) : null;
    }
    async findByEmail(email) {
        const client = await prisma_1.default.client.findFirst({ where: { email } });
        return client ? mapClient(client) : null;
    }
    async create(data) {
        const client = await prisma_1.default.client.create({ data: data });
        return mapClient(client);
    }
    async update(id, data) {
        const client = await prisma_1.default.client.update({ where: { id }, data: data });
        return mapClient(client);
    }
    async delete(id) {
        await prisma_1.default.client.delete({ where: { id } });
    }
    async getHistory(clientId) {
        const orders = await prisma_1.default.order.findMany({
            where: { clientId },
            include: { items: { include: { product: true } }, payments: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map((o) => ({
            ...mapOrder(o),
            items: o.items?.map(mapOrderItem) ?? [],
            payments: o.payments?.map(mapPayment) ?? [],
        }));
    }
}
exports.PrismaClientRepository = PrismaClientRepository;
// ─── Collection Account Repository ────────────────────────────────────────────
class PrismaCollectionAccountRepository {
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.clientId)
            where.clientId = filters.clientId;
        const accounts = await prisma_1.default.collectionAccount.findMany({ where, orderBy: { createdAt: 'desc' } });
        return accounts.map(mapCollectionAccount);
    }
    async findById(id) {
        const account = await prisma_1.default.collectionAccount.findUnique({
            where: { id },
            include: { client: true, payments: true },
        });
        if (!account)
            return null;
        return {
            ...mapCollectionAccount(account),
            client: mapClient(account.client),
            payments: account.payments.map(mapCollectionPayment),
        };
    }
    async findByClient(clientId) {
        const accounts = await prisma_1.default.collectionAccount.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' } });
        return accounts.map(mapCollectionAccount);
    }
    async create(data) {
        const account = await prisma_1.default.collectionAccount.create({ data: data });
        return mapCollectionAccount(account);
    }
    async update(id, data) {
        const account = await prisma_1.default.collectionAccount.update({ where: { id }, data: data });
        return mapCollectionAccount(account);
    }
    async delete(id) {
        await prisma_1.default.collectionAccount.delete({ where: { id } });
    }
    async findWithPayments(id) {
        const account = await prisma_1.default.collectionAccount.findUnique({
            where: { id },
            include: { payments: { orderBy: { createdAt: 'desc' } } },
        });
        if (!account)
            return null;
        return { ...mapCollectionAccount(account), payments: account.payments.map(mapCollectionPayment) };
    }
}
exports.PrismaCollectionAccountRepository = PrismaCollectionAccountRepository;
// ─── Collection Payment Repository ────────────────────────────────────────────
class PrismaCollectionPaymentRepository {
    async findAll() {
        const payments = await prisma_1.default.collectionPayment.findMany({ orderBy: { createdAt: 'desc' } });
        return payments.map(mapCollectionPayment);
    }
    async findById(id) {
        const payment = await prisma_1.default.collectionPayment.findUnique({ where: { id } });
        return payment ? mapCollectionPayment(payment) : null;
    }
    async findByCollectionAccount(collectionAccountId) {
        const payments = await prisma_1.default.collectionPayment.findMany({
            where: { collectionAccountId },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map(mapCollectionPayment);
    }
    async create(data) {
        const payment = await prisma_1.default.collectionPayment.create({ data: data });
        return mapCollectionPayment(payment);
    }
}
exports.PrismaCollectionPaymentRepository = PrismaCollectionPaymentRepository;
// ─── Cash Register Repository ─────────────────────────────────────────────────
class PrismaCashRegisterRepository {
    async findOpenRegister() {
        const reg = await prisma_1.default.cashRegister.findFirst({
            where: { status: 'OPEN' },
            orderBy: { openedAt: 'desc' },
        });
        return reg ? mapCashRegister(reg) : null;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate)
                where.date.gte = filters.startDate;
            if (filters.endDate)
                where.date.lte = filters.endDate;
        }
        const registers = await prisma_1.default.cashRegister.findMany({ where, orderBy: { date: 'desc' } });
        return registers.map(mapCashRegister);
    }
    async findById(id) {
        const reg = await prisma_1.default.cashRegister.findUnique({ where: { id } });
        return reg ? mapCashRegister(reg) : null;
    }
    async create(data) {
        const reg = await prisma_1.default.cashRegister.create({ data: data });
        return mapCashRegister(reg);
    }
    async update(id, data) {
        const reg = await prisma_1.default.cashRegister.update({ where: { id }, data: data });
        return mapCashRegister(reg);
    }
    async closeRegister(id, data) {
        const reg = await prisma_1.default.cashRegister.update({
            where: { id },
            data: {
                finalAmount: data.finalAmount,
                status: 'CLOSED',
                closedBy: data.closedBy,
                closedAt: new Date(),
                notes: data.notes ?? undefined,
            },
        });
        return mapCashRegister(reg);
    }
    async findMovementsByRegister(cashRegisterId) {
        const movements = await prisma_1.default.cashMovement.findMany({
            where: { cashRegisterId },
            orderBy: { createdAt: 'asc' },
        });
        return movements.map(mapCashMovement);
    }
    async findMovementsByAccountAndDate(accountId, startDate, endDate) {
        const movements = await prisma_1.default.cashMovement.findMany({
            where: {
                accountId,
                createdAt: { gte: startDate, lte: endDate },
            },
            orderBy: { createdAt: 'asc' },
        });
        return movements.map(mapCashMovement);
    }
    async createMovement(data) {
        const movement = await prisma_1.default.cashMovement.create({ data: data });
        return mapCashMovement(movement);
    }
}
exports.PrismaCashRegisterRepository = PrismaCashRegisterRepository;
//# sourceMappingURL=index.js.map