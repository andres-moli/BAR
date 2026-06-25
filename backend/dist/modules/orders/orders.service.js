"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const orders_entity_1 = require("./orders.entity");
const errors_1 = require("../../shared/errors");
const TAX_RATE = 0.19;
class OrdersService {
    orderRepo;
    itemRepo;
    productRepo;
    constructor(orderRepo, itemRepo, productRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
    }
    async findAll(filters) {
        const qb = this.orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.table', 'table')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .orderBy('order.createdAt', 'DESC');
        if (filters?.status)
            qb.andWhere('order.status = :status', { status: filters.status });
        if (filters?.tableId)
            qb.andWhere('order.tableId = :tableId', { tableId: filters.tableId });
        if (filters?.userId)
            qb.andWhere('order.userId = :userId', { userId: filters.userId });
        if (filters?.clientId)
            qb.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
        if (filters?.startDate)
            qb.andWhere('order.createdAt >= :startDate', { startDate: filters.startDate });
        if (filters?.endDate)
            qb.andWhere('order.createdAt <= :endDate', { endDate: filters.endDate });
        return qb.getMany();
    }
    async findById(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['table', 'user', 'client', 'items', 'items.product', 'payments', 'invoice'],
        });
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        return order;
    }
    async create(dto) {
        const order = this.orderRepo.create({
            tableId: dto.tableId,
            clientId: dto.clientId,
            notes: dto.notes,
            userId: dto.userId,
            subtotal: 0,
            tax: 0,
            total: 0,
            discount: 0,
            status: orders_entity_1.OrderStatus.OPEN,
        });
        return this.orderRepo.save(order);
    }
    async addItem(orderId, dto) {
        const order = await this.findById(orderId);
        if (order.status === orders_entity_1.OrderStatus.COMPLETED || order.status === orders_entity_1.OrderStatus.CANCELLED) {
            throw new errors_1.ConflictError('Cannot modify a completed or cancelled order');
        }
        const product = await this.productRepo.findOne({ where: { id: dto.productId } });
        if (!product)
            throw new errors_1.NotFoundError('Product not found');
        const quantity = dto.quantity;
        const unitPrice = Number(product.price);
        const subtotal = Number((unitPrice * quantity).toFixed(2));
        const item = this.itemRepo.create({
            orderId,
            productId: dto.productId,
            quantity,
            unitPrice,
            subtotal,
            notes: dto.notes,
        });
        await this.itemRepo.save(item);
        await this.recalculateTotals(orderId);
        return item;
    }
    async updateItem(itemId, dto) {
        const item = await this.itemRepo.findOne({ where: { id: itemId }, relations: ['order'] });
        if (!item)
            throw new errors_1.NotFoundError('Order item not found');
        if (item.order.status === orders_entity_1.OrderStatus.COMPLETED || item.order.status === orders_entity_1.OrderStatus.CANCELLED) {
            throw new errors_1.ConflictError('Cannot modify a completed or cancelled order');
        }
        if (dto.quantity !== undefined) {
            item.quantity = dto.quantity;
            item.subtotal = Number((Number(item.unitPrice) * dto.quantity).toFixed(2));
        }
        if (dto.notes !== undefined)
            item.notes = dto.notes;
        await this.itemRepo.save(item);
        await this.recalculateTotals(item.orderId);
        return item;
    }
    async removeItem(itemId) {
        const item = await this.itemRepo.findOne({ where: { id: itemId }, relations: ['order'] });
        if (!item)
            throw new errors_1.NotFoundError('Order item not found');
        if (item.order.status === orders_entity_1.OrderStatus.COMPLETED || item.order.status === orders_entity_1.OrderStatus.CANCELLED) {
            throw new errors_1.ConflictError('Cannot modify a completed or cancelled order');
        }
        const orderId = item.orderId;
        await this.itemRepo.remove(item);
        await this.recalculateTotals(orderId);
    }
    async changeTable(orderId, tableId) {
        const order = await this.findById(orderId);
        order.tableId = tableId;
        return this.orderRepo.save(order);
    }
    async splitOrder(orderId, dto) {
        const sourceOrder = await this.findById(orderId);
        if (sourceOrder.status === orders_entity_1.OrderStatus.COMPLETED || sourceOrder.status === orders_entity_1.OrderStatus.CANCELLED) {
            throw new errors_1.ConflictError('Cannot split a completed or cancelled order');
        }
        const newOrder = this.orderRepo.create({
            tableId: dto.tableId || sourceOrder.tableId,
            userId: sourceOrder.userId,
            clientId: sourceOrder.clientId,
            notes: `Split from order ${sourceOrder.id}`,
            status: orders_entity_1.OrderStatus.OPEN,
            subtotal: 0,
            tax: 0,
            total: 0,
            discount: 0,
        });
        await this.orderRepo.save(newOrder);
        for (const splitItem of dto.items) {
            const sourceItem = sourceOrder.items.find(i => i.id === splitItem.itemId);
            if (!sourceItem)
                throw new errors_1.NotFoundError(`Item ${splitItem.itemId} not found in source order`);
            const moveQuantity = Math.min(splitItem.quantity, sourceItem.quantity);
            if (moveQuantity <= 0)
                continue;
            const newItem = this.itemRepo.create({
                orderId: newOrder.id,
                productId: sourceItem.productId,
                quantity: moveQuantity,
                unitPrice: sourceItem.unitPrice,
                subtotal: Number((Number(sourceItem.unitPrice) * moveQuantity).toFixed(2)),
            });
            await this.itemRepo.save(newItem);
            sourceItem.quantity -= moveQuantity;
            sourceItem.subtotal = Number((Number(sourceItem.unitPrice) * sourceItem.quantity).toFixed(2));
            if (sourceItem.quantity <= 0) {
                await this.itemRepo.remove(sourceItem);
            }
            else {
                await this.itemRepo.save(sourceItem);
            }
        }
        await this.recalculateTotals(sourceOrder.id);
        await this.recalculateTotals(newOrder.id);
        return this.findById(newOrder.id);
    }
    async getHistory(orderId) {
        const order = await this.findById(orderId);
        return {
            order,
            payments: order.payments || [],
            invoice: order.invoice || null,
        };
    }
    async recalculateTotals(orderId) {
        const items = await this.itemRepo.find({ where: { orderId } });
        const subtotal = Number(items.reduce((sum, item) => sum + Number(item.subtotal), 0).toFixed(2));
        const tax = Number((subtotal * TAX_RATE).toFixed(2));
        const order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order)
            throw new errors_1.NotFoundError('Order not found for recalculation');
        order.subtotal = subtotal;
        order.tax = tax;
        order.total = Number((subtotal + tax - Number(order.discount)).toFixed(2));
        await this.orderRepo.save(order);
    }
}
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map