import { Repository } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { Payment } from '../payments/payments.entity';
import { TableEntity } from '../tables/tables.entity';
import { CollectionAccount } from '../collections/collections.entity';

export class ReportsService {
  constructor(
    private orderRepo: Repository<Order>,
    private paymentRepo: Repository<Payment>,
  ) {}

  async salesByDay(startDate?: Date, endDate?: Date) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select("DATE(o.createdAt)", "date")
      .addSelect('SUM(o.total)', 'total')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (startDate) qb.andWhere('o.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('o.createdAt <= :endDate', { endDate });
    return qb.groupBy('DATE(o.createdAt)').orderBy('DATE(o.createdAt)', 'DESC').getRawMany();
  }

  async salesByMonth(year?: number, month?: number) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select("EXTRACT(YEAR FROM o.createdAt)", "year")
      .addSelect("EXTRACT(MONTH FROM o.createdAt)", "month")
      .addSelect('SUM(o.total)', 'total')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (year) qb.andWhere("EXTRACT(YEAR FROM o.createdAt) = :year", { year });
    if (month) qb.andWhere("EXTRACT(MONTH FROM o.createdAt) = :month", { month });
    return qb.groupBy('EXTRACT(YEAR FROM o.createdAt), EXTRACT(MONTH FROM o.createdAt)')
      .orderBy('EXTRACT(YEAR FROM o.createdAt)', 'DESC')
      .addOrderBy('EXTRACT(MONTH FROM o.createdAt)', 'DESC')
      .getRawMany();
  }

  async salesByProduct(startDate?: Date, endDate?: Date) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select('p.name', 'product')
      .addSelect('SUM(oi.quantity)', 'quantity')
      .addSelect('SUM(oi.subtotal)', 'total')
      .innerJoin('o.items', 'oi')
      .innerJoin('oi.product', 'p')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (startDate) qb.andWhere('o.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('o.createdAt <= :endDate', { endDate });
    return qb.groupBy('p.name').orderBy('SUM(oi.subtotal)', 'DESC').getRawMany();
  }

  async salesByCategory(startDate?: Date, endDate?: Date) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select('c.name', 'category')
      .addSelect('SUM(oi.quantity)', 'quantity')
      .addSelect('SUM(oi.subtotal)', 'total')
      .innerJoin('o.items', 'oi')
      .innerJoin('oi.product', 'p')
      .innerJoin('p.category', 'c')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (startDate) qb.andWhere('o.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('o.createdAt <= :endDate', { endDate });
    return qb.groupBy('c.name').orderBy('SUM(oi.subtotal)', 'DESC').getRawMany();
  }

  async salesByUser(startDate?: Date, endDate?: Date) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select('u.name', 'user')
      .addSelect('COUNT(o.id)', 'orders')
      .addSelect('SUM(o.total)', 'total')
      .innerJoin('o.user', 'u')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (startDate) qb.andWhere('o.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('o.createdAt <= :endDate', { endDate });
    return qb.groupBy('u.name').orderBy('SUM(o.total)', 'DESC').getRawMany();
  }

  async topProducts(limit = 10, startDate?: Date, endDate?: Date) {
    const qb = this.orderRepo.createQueryBuilder('o')
      .select('p.id', 'id')
      .addSelect('p.name', 'name')
      .addSelect('SUM(oi.quantity)', 'quantity')
      .addSelect('SUM(oi.subtotal)', 'total')
      .innerJoin('o.items', 'oi')
      .innerJoin('oi.product', 'p')
      .where('o.status = :status', { status: 'COMPLETED' });
    if (startDate) qb.andWhere('o.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('o.createdAt <= :endDate', { endDate });
    return qb.groupBy('p.id').addGroupBy('p.name')
      .orderBy('SUM(oi.subtotal)', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async paymentMethodsReport(startDate?: Date, endDate?: Date) {
    const qb = this.paymentRepo.createQueryBuilder('p')
      .select('pm.name', 'method')
      .addSelect('COUNT(p.id)', 'count')
      .addSelect('SUM(p.amount)', 'total')
      .innerJoin('p.paymentMethod', 'pm');
    if (startDate) qb.andWhere('p.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('p.createdAt <= :endDate', { endDate });
    return qb.groupBy('pm.name').orderBy('SUM(p.amount)', 'DESC').getRawMany();
  }

  async collectionsReport() {
    const { CollectionAccount } = require('../collections/collections.entity');
    const repo: Repository<any> = this.orderRepo.manager.getRepository(CollectionAccount);
    return repo.createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('COUNT(c.id)', 'count')
      .addSelect('SUM(c.totalAmount)', 'totalAmount')
      .addSelect('SUM(c.paidAmount)', 'paidAmount')
      .groupBy('c.status')
      .getRawMany();
  }

  async dashboard() {
    const tableRepo = this.orderRepo.manager.getRepository(TableEntity);
    const collectionRepo = this.orderRepo.manager.getRepository(CollectionAccount);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      ventasDiaResult,
      ordenesActivas,
      mesasOcupadas,
      mesasDisponibles,
      cuentasPendientes,
      ventasPorDia,
      productosMasVendidos,
      metodosPago,
      ventasPorPeriodo,
    ] = await Promise.all([
      this.orderRepo.createQueryBuilder('o')
        .select('SUM(o.total)', 'total')
        .where('o.status = :status', { status: 'COMPLETED' })
        .andWhere('o.createdAt >= :start', { start: today })
        .andWhere('o.createdAt < :end', { end: tomorrow })
        .getRawOne(),
      this.orderRepo.createQueryBuilder('o')
        .select('COUNT(o.id)', 'count')
        .where('o.status IN (:...statuses)', { statuses: ['OPEN', 'IN_PROGRESS'] })
        .getRawOne(),
      tableRepo.createQueryBuilder('t')
        .select('COUNT(t.id)', 'count')
        .where('t.status = :status', { status: 'OCCUPIED' })
        .getRawOne(),
      tableRepo.createQueryBuilder('t')
        .select('COUNT(t.id)', 'count')
        .where('t.status = :status', { status: 'AVAILABLE' })
        .getRawOne(),
      collectionRepo.createQueryBuilder('c')
        .select('COUNT(c.id)', 'count')
        .where('c.status != :status', { status: 'PAID' })
        .getRawOne(),
      this.salesByDay(sevenDaysAgo, today),
      this.topProducts(5),
      this.paymentMethodsReport(),
      this.salesByMonth(),
    ]);

    return {
      ventas_dia: Number(ventasDiaResult?.total) || 0,
      ordenes_activas: Number(ordenesActivas?.count) || 0,
      mesas_ocupadas: Number(mesasOcupadas?.count) || 0,
      mesas_disponibles: Number(mesasDisponibles?.count) || 0,
      cuentas_pendientes: Number(cuentasPendientes?.count) || 0,
      ventas_por_dia: ventasPorDia.map((r: any) => ({ fecha: r.date, total: Number(r.total) })),
      productos_mas_vendidos: productosMasVendidos.map((r: any) => ({ nombre: r.name, cantidad: Number(r.quantity), total: Number(r.total) })),
      metodos_pago: metodosPago.map((r: any) => ({ metodo: r.method, total: Number(r.total), cantidad: Number(r.count) })),
      ventas_por_periodo: ventasPorPeriodo.map((r: any) => ({ periodo: `${r.year}-${String(r.month).padStart(2, '0')}`, total: Number(r.total) })),
    };
  }

  async clientsWithDebt() {
    const { CollectionAccount } = require('../collections/collections.entity');
    const repo: Repository<any> = this.orderRepo.manager.getRepository(CollectionAccount);
    return repo.createQueryBuilder('c')
      .innerJoinAndSelect('c.client', 'cl')
      .where('c.status != :status', { status: 'PAID' })
      .orderBy('c.createdAt', 'DESC')
      .getMany();
  }
}
