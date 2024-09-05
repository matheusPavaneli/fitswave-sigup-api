import { Router } from "express";
import speakeasy from "speakeasy";

import User from "../models/User";
import UserRepository from "../repositories/UserRepository";
import AuthService from "../services/AuthService";
import AuthController from "../controllers/AuthController";
import TokenService from "../services/TokenService";
import Validation from "../helpers/Validation";
import validateData from "../middlewares/validateData";
import authMiddleware from "../middlewares/authMiddleware";
import MailService from "../services/MailService";
import transporter from "../config/emailTransporter";
import TwoFactorRepository from "../repositories/TwoFactorRepository";
import User2FA from "../models/User2FA";
import verifyTwoFactor from "../middlewares/verifyTwoFactor";
import TwoFactorService from "../services/TwoFactorService";
import SpeakeasyService from "../services/SpeakeasyService";

const router = Router();

const user2FARepository = new TwoFactorRepository(User2FA);
const speakeasyService = new SpeakeasyService(speakeasy);
const twoFactorService = new TwoFactorService(
  user2FARepository,
  speakeasyService
);
const tokenService = new TokenService();
const userRepository = new UserRepository(User);
const authService = new AuthService(userRepository);
const mailService = new MailService(transporter);
const authController = new AuthController(
  authService,
  tokenService,
  mailService,
  twoFactorService
);

router.post(
  "/signin",
  validateData(Validation.userLoginSchema),
  authController.authenticate,
  verifyTwoFactor
);

router.post("/logout", authMiddleware, authController.logout);
router.post(
  "/forgot-password",
  validateData(Validation.requestResetPassword),
  authController.requestPasswordReset
);
router.post(
  "/reset-password",
  validateData(Validation.resetPassword),
  authController.resetPassword
);

export default router;
