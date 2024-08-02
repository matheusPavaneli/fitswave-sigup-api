import { Router } from 'express';

import UserService from '../services/UserService';
import User from '../models/User';
import UserController from '../controllers/UserController';
import UserRepository from '../repositories/UserRepository';
import validateData from '../middlewares/validateData';
import Validation from '../helpers/Validation';
import TokenService from '../services/TokenService';

const router = Router();

// Token
const tokenService = new TokenService();

// User
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository, tokenService);

const userController = new UserController(userService, tokenService);

router.post(
  '/sigup',
  validateData(Validation.userCreationSchema),
  userController.createUser,
);

router.post(
  '/update',
  validateData(Validation.userUpdateSchema),
  userController.updateUser,
);

export default router;
