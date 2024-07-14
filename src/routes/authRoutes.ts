import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import AuthService from '../services/AuthService';
import AuthController from '../controllers/AuthController';
import TokenService from '../services/TokenService';
import Validation from '../helpers/validation';
import validateData from '../middlewares/validateData';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

const tokenService = new TokenService(jwt);
const userRepository = new UserRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService, tokenService);

router.post(
  '/signin',
  validateData(Validation.userLoginSchema),
  authController.authenticate,
);

router.post(
  '/reset-password',
  validateData(Validation.passwordResetSchema),
  authController.resetPassword,
);

router.post('/logout', authMiddleware, authController.logout);

export default router;
