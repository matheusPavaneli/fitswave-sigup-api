import { Router } from "express";

import UserService from "../services/UserService";
import User from "../models/User";
import UserController from "../controllers/UserController";
import UserRepository from "../repositories/UserRepository";
import validateData from "../middlewares/validateData";
import Validation from "../helpers/Validation";
import TokenService from "../services/TokenService";
import User2FAService from "../services/User2FAService";
import User2FA from "../models/User2FA";
import User2FARepository from "../repositories/User2FARepository";

const router = Router();

// Token
const tokenService = new TokenService();

// 2FAService
const user2FARepository = new User2FARepository(User2FA);
const user2FAService = new User2FAService(user2FARepository);

// User
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository, tokenService);

const userController = new UserController(
  userService,
  tokenService,
  user2FAService
);

router.post(
  "/signup",
  validateData(Validation.userCreationSchema),
  userController.createUser
);

router.post(
  "/update",
  validateData(Validation.userUpdateSchema),
  userController.updateUser
);

export default router;
