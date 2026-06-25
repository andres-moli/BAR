import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return fn(req, res, next).catch(next);
};

export class UsersController {
  constructor(private usersService: UsersService) {}

  getAll: Handler = wrap(async (req, res) => {
    const users = await this.usersService.findAll();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || users.length || 15;
    const total = users.length;
    res.json({ success: true, data: { data: users, total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  getById: Handler = wrap(async (req, res) => {
    const user = await this.usersService.findById(req.params.id as string);
    res.json({ success: true, data: user });
  });

  create: Handler = wrap(async (req, res) => {
    const user = await this.usersService.create(req.body);
    res.status(201).json({ success: true, data: user });
  });

  update: Handler = wrap(async (req, res) => {
    const user = await this.usersService.update(req.params.id as string, req.body);
    res.json({ success: true, data: user });
  });

  delete: Handler = wrap(async (req, res) => {
    await this.usersService.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });

  toggleActive: Handler = wrap(async (req, res) => {
    const user = await this.usersService.toggleActive(req.params.id as string);
    res.json({ success: true, data: user });
  });
}
