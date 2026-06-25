import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return fn(req, res, next).catch(next);
};

export class AuthController {
  constructor(private authService: AuthService) {}

  login: Handler = wrap(async (req, res) => {
    const result = await this.authService.login(req.body);
    res.json({ success: true, data: result });
  });

  getProfile: Handler = wrap(async (req, res) => {
    const user = await this.authService.getProfile(req.user!.id);
    res.json({ success: true, data: user });
  });

  updateProfile: Handler = wrap(async (req, res) => {
    const user = await this.authService.updateProfile(req.user!.id, req.body);
    res.json({ success: true, data: user });
  });
}
