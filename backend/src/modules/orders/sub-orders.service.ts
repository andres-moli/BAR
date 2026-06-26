import { Repository, IsNull } from 'typeorm';
import { SubOrder, SubOrderStatus } from './sub-order.entity';
import { OrderItem } from './order-item.entity';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class SubOrdersService {
  constructor(
    private subOrderRepo: Repository<SubOrder>,
    private itemRepo: Repository<OrderItem>,
  ) {}

  async create(orderId: string, userId: string): Promise<SubOrder> {
    const ungrouped = await this.itemRepo.find({
      where: { orderId, subOrderId: IsNull() },
      relations: ['product'],
    });
    if (ungrouped.length === 0) throw new ConflictError('No hay productos sin agrupar');

    const subOrder = this.subOrderRepo.create({
      orderId,
      status: SubOrderStatus.CONFIRMADO,
      createdBy: userId,
    });
    await this.subOrderRepo.save(subOrder);

    await this.itemRepo.update(
      ungrouped.map(i => i.id),
      { subOrderId: subOrder.id },
    );

    return this.subOrderRepo.findOne({
      where: { id: subOrder.id },
      relations: ['creator'],
    }) as Promise<SubOrder>;
  }

  async confirm(id: string): Promise<SubOrder> {
    const subOrder = await this.subOrderRepo.findOne({ where: { id }, relations: ['creator'] });
    if (!subOrder) throw new NotFoundError('Sub-orden no encontrada');
    if (subOrder.status !== SubOrderStatus.PENDIENTE) throw new ConflictError('Solo se pueden confirmar sub-órdenes pendientes');

    subOrder.status = SubOrderStatus.CONFIRMADO;
    return this.subOrderRepo.save(subOrder);
  }

  async deliver(id: string, userId: string): Promise<SubOrder> {
    const subOrder = await this.subOrderRepo.findOne({ where: { id }, relations: ['creator'] });
    if (!subOrder) throw new NotFoundError('Sub-orden no encontrada');
    if (subOrder.status !== SubOrderStatus.CONFIRMADO) throw new ConflictError('Solo se pueden entregar sub-órdenes confirmadas');

    subOrder.status = SubOrderStatus.ENTREGADO;
    subOrder.deliveredBy = userId;
    subOrder.deliveredAt = new Date();
    return this.subOrderRepo.save(subOrder);
  }

  async getPending(): Promise<SubOrder[]> {
    return this.subOrderRepo.find({
      where: { status: SubOrderStatus.CONFIRMADO },
      relations: ['creator', 'order', 'order.table'],
      order: { createdAt: 'ASC' },
    });
  }

  async getByOrder(orderId: string): Promise<SubOrder[]> {
    return this.subOrderRepo.find({
      where: { orderId },
      relations: ['creator', 'deliverer'],
      order: { createdAt: 'ASC' },
    });
  }

  async getItems(subOrderId: string): Promise<OrderItem[]> {
    return this.itemRepo.find({
      where: { subOrderId },
      relations: ['product'],
    });
  }
}
