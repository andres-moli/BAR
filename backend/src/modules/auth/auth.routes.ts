import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { User } from '../users/users.entity';
import { config } from '../../config/index';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { loginSchema, updateProfileSchema } from './auth.validator';

export function registerAuthRoutes(router: Router): void {
  const subrouter = Router();
  const userRepo = AppDataSource.getRepository(User);
  const authService = new AuthService(userRepo, config.jwtSecret, config.jwtExpiresIn);
  const authController = new AuthController(authService);

  subrouter.post('/login', validate(loginSchema), authController.login);
  subrouter.get('/profile', authenticate, authController.getProfile);
  subrouter.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

  router.use('/auth', subrouter);
}
