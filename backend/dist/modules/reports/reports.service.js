"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
class ReportsService {
    orderRepo;
    paymentRepo;
    constructor(orderRepo, paymentRepo) {
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }
    async salesByDay(startDate, endDate) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select("DATE(o.createdAt)", "date")
            .addSelect('SUM(o.total)', 'total')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (startDate)
            qb.andWhere('o.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('o.createdAt <= :endDate', { endDate });
        return qb.groupBy('DATE(o.createdAt)').orderBy('DATE(o.createdAt)', 'DESC').getRawMany();
    }
    async salesByMonth(year, month) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select("EXTRACT(YEAR FROM o.createdAt)", "year")
            .addSelect("EXTRACT(MONTH FROM o.createdAt)", "month")
            .addSelect('SUM(o.total)', 'total')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (year)
            qb.andWhere("EXTRACT(YEAR FROM o.createdAt) = :year", { year });
        if (month)
            qb.andWhere("EXTRACT(MONTH FROM o.createdAt) = :month", { month });
        return qb.groupBy('EXTRACT(YEAR FROM o.createdAt), EXTRACT(MONTH FROM o.createdAt)')
            .orderBy('EXTRACT(YEAR FROM o.createdAt)', 'DESC')
            .addOrderBy('EXTRACT(MONTH FROM o.createdAt)', 'DESC')
            .getRawMany();
    }
    async salesByProduct(startDate, endDate) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select('p.name', 'product')
            .addSelect('SUM(oi.quantity)', 'quantity')
            .addSelect('SUM(oi.subtotal)', 'total')
            .innerJoin('o.items', 'oi')
            .innerJoin('oi.product', 'p')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (startDate)
            qb.andWhere('o.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('o.createdAt <= :endDate', { endDate });
        return qb.groupBy('p.name').orderBy('SUM(oi.subtotal)', 'DESC').getRawMany();
    }
    async salesByCategory(startDate, endDate) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select('c.name', 'category')
            .addSelect('SUM(oi.quantity)', 'quantity')
            .addSelect('SUM(oi.subtotal)', 'total')
            .innerJoin('o.items', 'oi')
            .innerJoin('oi.product', 'p')
            .innerJoin('p.category', 'c')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (startDate)
            qb.andWhere('o.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('o.createdAt <= :endDate', { endDate });
        return qb.groupBy('c.name').orderBy('SUM(oi.subtotal)', 'DESC').getRawMany();
    }
    async salesByUser(startDate, endDate) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select('u.name', 'user')
            .addSelect('COUNT(o.id)', 'orders')
            .addSelect('SUM(o.total)', 'total')
            .innerJoin('o.user', 'u')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (startDate)
            qb.andWhere('o.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('o.createdAt <= :endDate', { endDate });
        return qb.groupBy('u.name').orderBy('SUM(o.total)', 'DESC').getRawMany();
    }
    async topProducts(limit = 10, startDate, endDate) {
        const qb = this.orderRepo.createQueryBuilder('o')
            .select('p.id', 'id')
            .addSelect('p.name', 'name')
            .addSelect('SUM(oi.quantity)', 'quantity')
            .addSelect('SUM(oi.subtotal)', 'total')
            .innerJoin('o.items', 'oi')
            .innerJoin('oi.product', 'p')
            .where('o.status = :status', { status: 'COMPLETED' });
        if (startDate)
            qb.andWhere('o.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('o.createdAt <= :endDate', { endDate });
        return qb.groupBy('p.id').addGroupBy('p.name')
            .orderBy('SUM(oi.subtotal)', 'DESC')
            .limit(limit)
            .getRawMany();
    }
    async paymentMethodsReport(startDate, endDate) {
        const qb = this.paymentRepo.createQueryBuilder('p')
            .select('pm.name', 'method')
            .addSelect('COUNT(p.id)', 'count')
            .addSelect('SUM(p.amount)', 'total')
            .innerJoin('p.paymentMethod', 'pm');
        if (startDate)
            qb.andWhere('p.createdAt >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('p.createdAt <= :endDate', { endDate });
        return qb.groupBy('pm.name').orderBy('SUM(p.amount)', 'DESC').getRawMany();
    }
    async collectionsReport() {
        const { CollectionAccount } = require('../collections/collections.entity');
        const repo = this.orderRepo.manager.getRepository(CollectionAccount);
        return repo.createQueryBuilder('c')
            .select('c.status', 'status')
            .addSelect('COUNT(c.id)', 'count')
            .addSelect('SUM(c.totalAmount)', 'totalAmount')
            .addSelect('SUM(c.paidAmount)', 'paidAmount')
            .groupBy('c.status')
            .getRawMany();
    }
    async clientsWithDebt() {
        const { CollectionAccount } = require('../collections/collections.entity');
        const repo = this.orderRepo.manager.getRepository(CollectionAccount);
        return repo.createQueryBuilder('c')
            .innerJoinAndSelect('c.client', 'cl')
            .where('c.status != :status', { status: 'PAID' })
            .orderBy('c.createdAt', 'DESC')
            .getMany();
    }
}
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map