import { Router } from "express";

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
import TwoFactorController from "../controllers/TwoFactorController";
import TwoFactorService from "../services/TwoFactorService";
import TwoFactorRepository from "../repositories/TwoFactorRepository";
import User2FA from "../models/User2FA";
import SpeakeasyService from "../services/SpeakeasyService";
import speakeasy from "speakeasy";

const router = Router();

const tokenService = new TokenService();
const speakeasyService = new SpeakeasyService(speakeasy);
const user2FARepository = new TwoFactorRepository(User2FA);
const user2FAService = new TwoFactorService(
  user2FARepository,
  speakeasyService
);
const twoFactorController = new TwoFactorController(
  tokenService,
  user2FAService,
  speakeasyService
);

router.post("/setup", authMiddleware, twoFactorController.setup);
router.post("/activate", authMiddleware, twoFactorController.activate);
router.post("/deactivate", authMiddleware, twoFactorController.deactivate);
router.post(
  "/verify",
  authMiddleware,
  validateData(Validation.twoFactorVerify),
  twoFactorController.verify
);

export default router;
