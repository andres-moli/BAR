import { Request, Response, NextFunction } from 'express';
import { InventarioService } from './inventario.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class InventarioController {
  constructor(private service: InventarioService) {}

  getInventory = wrap(async (req, res) => {
    const products = await this.service.getInventory(req.query as any);
    res.json({ success: true, data: products });
  });

  getProductStock = wrap(async (req, res) => {
    const product = await this.service.getProductStock(req.params.productId as string);
    res.json({ success: true, data: product });
  });

  getMovements = wrap(async (req, res) => {
    const movements = await this.service.getMovements(req.params.productId as string);
    res.json({ success: true, data: movements });
  });

  createMovement = wrap(async (req, res) => {
    const userId = (req as any).user?.id;
    const movement = await this.service.createMovement(req.body, userId);
    res.status(201).json({ success: true, data: movement });
  });

  adjustStock = wrap(async (req, res) => {
    const userId = (req as any).user?.id;
    const product = await this.service.adjustStock(req.params.productId as string, req.body, userId);
    res.json({ success: true, data: product });
  });

  getLowStock = wrap(async (req, res) => {
    const products = await this.service.getLowStockProducts();
    res.json({ success: true, data: products });
  });
}
