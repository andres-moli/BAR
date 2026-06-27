import { Repository } from 'typeorm';
import { Order, OrderStatus } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/products.entity';
import { Movement } from '../products/movement.entity';
import { TableEntity, TableStatus } from '../tables/tables.entity';
import { Combo } from '../combos/combo.entity';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { CreateOrderDto, AddItemDto, UpdateItemDto, SplitOrderDto } from './orders.dto';

const TAX_RATE = 0;

export class OrdersService {
  constructor(
    private orderRepo: Repository<Order>,
    private itemRepo: Repository<OrderItem>,
    private productRepo: Repository<Product>,
    private tableRepo: Repository<TableEntity>,
    private movementRepo: Repository<Movement>,
    private comboRepo: Repository<Combo>,
  ) {}

  async findAll(filters?: { status?: string; tableId?: string; userId?: string; clientId?: string; startDate?: Date; endDate?: Date }): Promise<Order[]> {
    const qb = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.subOrders', 'subOrders')
      .leftJoinAndSelect('subOrders.creator', 'subOrderCreator')
      .orderBy('order.createdAt', 'DESC');

    if (filters?.status) qb.andWhere('order.status = :status', { status: filters.status });
    if (filters?.tableId) qb.andWhere('order.tableId = :tableId', { tableId: filters.tableId });
    if (filters?.userId) qb.andWhere('order.userId = :userId', { userId: filters.userId });
    if (filters?.clientId) qb.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
    if (filters?.startDate) qb.andWhere('order.createdAt >= :startDate', { startDate: filters.startDate });
    if (filters?.endDate) qb.andWhere('order.createdAt <= :endDate', { endDate: filters.endDate });

    const all = await qb.getMany();
    return this.filterLatestVersions(all);
  }

  private filterLatestVersions(orders: Order[]): Order[] {
    const map = new Map<string, Order>();
    for (const o of orders) {
      const key = o.versionGroupId || o.id;
      const existing = map.get(key);
      if (!existing || (o.version || 1) > (existing.version || 1)) {
        map.set(key, o);
      }
    }
    return Array.from(map.values());
  }

  private async findLatestInGroup(versionGroupId: string): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { versionGroupId },
      relations: ['table', 'user', 'client', 'items', 'items.product', 'subOrders', 'subOrders.creator', 'payments', 'payments.paymentMethod', 'payments.paymentMethod.account', 'invoice'],
      order: { version: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['table', 'user', 'client', 'items', 'items.product', 'subOrders', 'subOrders.creator', 'payments', 'payments.paymentMethod', 'payments.paymentMethod.account', 'invoice'],
    });
    if (!order) throw new NotFoundError('Order not found');
    if (order.versionGroupId) {
      const latest = await this.findLatestInGroup(order.versionGroupId);
      if (latest && latest.id !== id) return latest;
    }
    return order;
  }

  async getVersions(orderId: string): Promise<Order[]> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['table', 'user', 'client'],
    });
    if (!order) throw new NotFoundError('Order not found');
    if (!order.versionGroupId) return [order];

    return this.orderRepo.find({
      where: { versionGroupId: order.versionGroupId },
      relations: ['items', 'items.product', 'user'],
      order: { version: 'ASC' },
    });
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const versionGroupId = `vg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const order = this.orderRepo.create({
      tableId: dto.tableId,
      clientId: dto.clientId,
      notes: dto.notes,
      userId: dto.userId,
      subtotal: 0,
      tax: 0,
      total: 0,
      discount: 0,
      status: OrderStatus.OPEN,
      versionGroupId,
      version: 1,
    });
    const saved = await this.orderRepo.save(order);

    if (dto.tableId) {
      await this.tableRepo.update(dto.tableId, { status: TableStatus.OCCUPIED });
    }

    return saved;
  }

  private async cloneOrder(order: Order): Promise<Order> {
    const maxVersion = await this.orderRepo
      .createQueryBuilder('order')
      .select('MAX(order.version)', 'maxVer')
      .where('order.versionGroupId = :vg', { vg: order.versionGroupId })
      .getRawOne();

    const newOrder = this.orderRepo.create({
      tableId: order.tableId,
      userId: order.userId,
      clientId: order.clientId,
      notes: order.notes,
      status: order.status,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      discount: order.discount,
      versionGroupId: order.versionGroupId,
      version: (maxVersion?.maxVer || order.version || 1) + 1,
    });
    await this.orderRepo.save(newOrder);

    const items = await this.itemRepo.find({ where: { orderId: order.id } });
    for (const item of items) {
      const newItem = this.itemRepo.create({
        orderId: newOrder.id,
        productId: item.productId,
        comboId: item.comboId,
        comboName: item.comboName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        notes: item.notes,
      });
      await this.itemRepo.save(newItem);
    }

    return this.orderRepo.findOne({
      where: { id: newOrder.id },
      relations: ['items', 'items.product'],
    }) as Promise<Order>;
  }

  async addItem(orderId: string, dto: AddItemDto): Promise<{ item: OrderItem; newOrderId: string }> {
    const order = await this.findById(orderId);
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.PAID || order.status === OrderStatus.CANCELLED) {
      throw new ConflictError('Cannot modify a completed or paid or cancelled order');
    }

    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundError('Product not found');

    const newOrder = await this.cloneOrder(order);

    const quantity = dto.quantity;
    const unitPrice = Number(product.price);
    const subtotal = Number((unitPrice * quantity).toFixed(2));

    const item = this.itemRepo.create({
      orderId: newOrder.id,
      productId: dto.productId,
      quantity,
      unitPrice,
      subtotal,
      notes: dto.notes,
    });
    await this.itemRepo.save(item);

    await this.adjustStock(product, -quantity, `Agregado a pedido #${orderId}`, order.userId);
    await this.recalculateTotals(newOrder.id);
    return { item, newOrderId: newOrder.id };
  }

  async addCombo(orderId: string, dto: { comboId: string; quantity: number; userId?: string }): Promise<{ items: OrderItem[]; newOrderId: string }> {
    const order = await this.findById(orderId);
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.PAID || order.status === OrderStatus.CANCELLED) {
      throw new ConflictError('Cannot modify a completed or paid or cancelled order');
    }
    const combo = await this.comboRepo.findOne({ where: { id: dto.comboId }, relations: ['products', 'products.product'] });
    if (!combo) throw new NotFoundError('Combo not found');
    if (!combo.products?.length) throw new ConflictError('Combo has no products');

    const newOrder = await this.cloneOrder(order);
    const comboQty = dto.quantity || 1;
    const unitPrice = Number(combo.price);
    const subtotal = Number((unitPrice * comboQty).toFixed(2));

    const item = this.itemRepo.create({
      orderId: newOrder.id,
      comboId: dto.comboId,
      comboName: combo.name,
      quantity: comboQty,
      unitPrice,
      subtotal,
      notes: `Combo: ${combo.name}`,
    });
    await this.itemRepo.save(item);

    for (const cp of combo.products) {
      if (!cp.product) continue;
      const qty = cp.quantity * comboQty;
      await this.adjustStock(cp.product, -qty, `Combo #${combo.name} agregado a pedido #${orderId}`, order.userId);
    }

    await this.recalculateTotals(newOrder.id);
    return { items: [item], newOrderId: newOrder.id };
  }

  async updateItem(itemId: string, dto: UpdateItemDto): Promise<{ item: OrderItem; newOrderId: string }> {
    const currentItem = await this.itemRepo.findOne({ where: { id: itemId }, relations: ['order'] });
    if (!currentItem) throw new NotFoundError('Order item not found');
    if (currentItem.order.status === OrderStatus.COMPLETED || currentItem.order.status === OrderStatus.PAID || currentItem.order.status === OrderStatus.CANCELLED) {
      throw new ConflictError('Cannot modify a completed or paid or cancelled order');
    }

    const order = await this.findById(currentItem.orderId);
    const newOrder = await this.cloneOrder(order);

    const newItems = await this.itemRepo.find({ where: { orderId: newOrder.id } });
    const targetItem = newItems.find(i =>
      currentItem.comboId
        ? i.comboId === currentItem.comboId && Number(i.quantity) === Number(currentItem.quantity)
        : i.productId && Number(i.productId) === Number(currentItem.productId) && Number(i.quantity) === Number(currentItem.quantity)
    );
    const itemToUpdate = targetItem || (await this.itemRepo.findOne({
      where: currentItem.comboId
        ? { orderId: newOrder.id, comboId: currentItem.comboId }
        : { orderId: newOrder.id, productId: currentItem.productId! },
    }));

    if (!itemToUpdate) throw new NotFoundError('Could not find matching item in new version');

    const oldQty = Number(itemToUpdate.quantity);
    if (dto.quantity !== undefined) {
      itemToUpdate.quantity = dto.quantity;
      itemToUpdate.subtotal = Number((Number(itemToUpdate.unitPrice) * dto.quantity).toFixed(2));
    }
    if (dto.notes !== undefined) itemToUpdate.notes = dto.notes;

    await this.itemRepo.save(itemToUpdate);
    await this.recalculateTotals(newOrder.id);

    const diff = Number(itemToUpdate.quantity) - oldQty;
    if (diff !== 0) {
      if (currentItem.comboId) {
        const combo = await this.comboRepo.findOne({ where: { id: currentItem.comboId }, relations: ['products', 'products.product'] });
        if (combo) {
          for (const cp of combo.products) {
            if (!cp.product) continue;
            await this.adjustStock(cp.product, -(cp.quantity * diff), `Cantidad de combo ajustada en pedido #${order.id}`, order.userId);
          }
        }
      } else if (itemToUpdate.productId) {
        const product = await this.productRepo.findOne({ where: { id: itemToUpdate.productId } });
        if (product) {
          await this.adjustStock(product, -diff, `Cantidad ajustada en pedido #${order.id} (${oldQty} → ${itemToUpdate.quantity})`, order.userId);
        }
      }
    }

    const savedItem = await this.itemRepo.findOne({ where: { id: itemToUpdate.id }, relations: ['order'] });
    return { item: savedItem || itemToUpdate, newOrderId: newOrder.id };
  }

  async removeItem(itemId: string): Promise<{ newOrderId: string }> {
    const currentItem = await this.itemRepo.findOne({ where: { id: itemId }, relations: ['order'] });
    if (!currentItem) throw new NotFoundError('Order item not found');
    if (currentItem.order.status === OrderStatus.COMPLETED || currentItem.order.status === OrderStatus.PAID || currentItem.order.status === OrderStatus.CANCELLED) {
      throw new ConflictError('Cannot modify a completed or paid or cancelled order');
    }

    const order = await this.findById(currentItem.orderId);
    const newOrder = await this.cloneOrder(order);

    const newItems = await this.itemRepo.find({ where: { orderId: newOrder.id } });
    const itemToRemove = newItems.find(i =>
      currentItem.comboId
        ? i.comboId === currentItem.comboId && Number(i.quantity) === Number(currentItem.quantity)
        : i.productId && Number(i.productId) === Number(currentItem.productId) && Number(i.quantity) === Number(currentItem.quantity)
    ) || await this.itemRepo.findOne({
      where: currentItem.comboId
        ? { orderId: newOrder.id, comboId: currentItem.comboId }
        : { orderId: newOrder.id, productId: currentItem.productId! },
    });

    if (itemToRemove) {
      await this.itemRepo.remove(itemToRemove);

      if (currentItem.comboId) {
        const combo = await this.comboRepo.findOne({ where: { id: currentItem.comboId }, relations: ['products', 'products.product'] });
        if (combo) {
          for (const cp of combo.products) {
            if (!cp.product) continue;
            await this.adjustStock(cp.product, cp.quantity * Number(currentItem.quantity), `Combo eliminado de pedido #${order.id}`, order.userId);
          }
        }
      } else if (itemToRemove.productId) {
        const product = await this.productRepo.findOne({ where: { id: itemToRemove.productId } });
        if (product) {
          await this.adjustStock(product, Number(itemToRemove.quantity), `Eliminado de pedido #${order.id}`, order.userId);
        }
      }
    }

    await this.recalculateTotals(newOrder.id);
    return { newOrderId: newOrder.id };
  }

  async changeTable(orderId: string, tableId: string): Promise<Order> {
    const order = await this.findById(orderId);
    order.tableId = tableId;
    return this.orderRepo.save(order);
  }

  async splitOrder(orderId: string, dto: SplitOrderDto): Promise<Order> {
    const sourceOrder = await this.findById(orderId);
    if (sourceOrder.status === OrderStatus.COMPLETED || sourceOrder.status === OrderStatus.PAID || sourceOrder.status === OrderStatus.CANCELLED) {
      throw new ConflictError('Cannot split a completed or paid or cancelled order');
    }

    const versionGroupId = `vg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newOrder = this.orderRepo.create({
      tableId: dto.tableId || sourceOrder.tableId,
      userId: sourceOrder.userId,
      clientId: sourceOrder.clientId,
      notes: `Split from order ${sourceOrder.id}`,
      status: OrderStatus.OPEN,
      subtotal: 0,
      tax: 0,
      total: 0,
      discount: 0,
      versionGroupId,
      version: 1,
    });
    await this.orderRepo.save(newOrder);

    for (const splitItem of dto.items) {
      const sourceItem = sourceOrder.items.find(i => i.id === splitItem.itemId);
      if (!sourceItem) throw new NotFoundError(`Item ${splitItem.itemId} not found in source order`);

      const moveQuantity = Math.min(splitItem.quantity, sourceItem.quantity);
      if (moveQuantity <= 0) continue;

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
      } else {
        await this.itemRepo.save(sourceItem);
      }
    }

    await this.recalculateTotals(sourceOrder.id);
    await this.recalculateTotals(newOrder.id);

    return this.findById(newOrder.id);
  }

  async getHistory(orderId: string): Promise<any> {
    const order = await this.findById(orderId);
    return {
      order,
      payments: order.payments || [],
      invoice: order.invoice || null,
    };
  }

  async findByTable(tableId: string): Promise<Order[]> {
    const allOrders = await this.orderRepo.find({
      where: { tableId },
      relations: ['items', 'items.product', 'user', 'client', 'payments'],
      order: { createdAt: 'DESC' },
    });
    return this.filterLatestVersions(allOrders);
  }

  async findPendingApproval(): Promise<Order[]> {
    return this.orderRepo.find({
      where: [
        { version: 2, status: OrderStatus.OPEN },
        { version: 2, status: OrderStatus.IN_PROGRESS },
      ],
      relations: ['table', 'user', 'client', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.findById(orderId);
    order.status = status as OrderStatus;
    return this.orderRepo.save(order);
  }

  async cancel(orderId: string): Promise<Order> {
    const order = await this.findById(orderId);
    order.status = OrderStatus.CANCELLED;
    order.closedAt = new Date();
    return this.orderRepo.save(order);
  }

  private async adjustStock(product: Product, delta: number, description: string, userId: string): Promise<void> {
    if (delta === 0) return;
    product.stock = Math.max(0, Number(product.stock) + delta);
    await this.productRepo.save(product);

    const movement = this.movementRepo.create({
      type: delta < 0 ? 'EXIT' : 'ENTRY',
      quantity: Math.abs(delta),
      description,
      productId: product.id,
      userId,
    });
    await this.movementRepo.save(movement);
  }

  private async recalculateTotals(orderId: string): Promise<void> {
    const items = await this.itemRepo.find({ where: { orderId } });
    const subtotal = Number(items.reduce((sum, item) => sum + Number(item.subtotal), 0).toFixed(2));
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order not found for recalculation');
    order.subtotal = subtotal;
    order.tax = tax;
    order.total = Number((subtotal + tax - Number(order.discount)).toFixed(2));
    await this.orderRepo.save(order);
  }
}
