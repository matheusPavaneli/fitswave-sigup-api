import { Router } from 'express';

import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import AuthService from '../services/AuthService';
import AuthController from '../controllers/AuthController';
import TokenService from '../services/TokenService';
import Validation from '../helpers/Validation';
import validateData from '../middlewares/validateData';
import authMiddleware from '../middlewares/authMiddleware';
import MailService from '../services/MailService';
import transporter from '../config/emailTransporter';

const router = Router();

const tokenService = new TokenService();
const userRepository = new UserRepository(User);
const authService = new AuthService(userRepository);
const mailService = new MailService(transporter);
const authController = new AuthController(
  authService,
  tokenService,
  mailService,
);

router.post(
  '/signin',
  validateData(Validation.userLoginSchema),
  authController.authenticate,
);

router.post('/logout', authMiddleware, authController.logout);
router.post(
  '/forgot-password',
  validateData(Validation.requestResetPassword),
  authController.requestPasswordReset,
);
router.post(
  '/reset-password',
  validateData(Validation.resetPassword),
  authController.resetPassword,
);

export default router;
