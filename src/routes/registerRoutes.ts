import { Router } from 'express';

import UserService from '../services/UserService';
import User from '../models/User';
import RegisterController from '../controllers/RegisterController';
import UserRepository from '../repositories/UserRepository';
import validateData from '../middlewares/validateData';
import Validation from '../helpers/validation';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// User
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);

const registerController = new RegisterController(userService);

router.post(
  '/',
  authMiddleware,
  validateData(Validation.userCreationSchema),
  registerController.createUser,
);

export default router;
