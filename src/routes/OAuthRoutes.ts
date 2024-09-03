import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

import TokenService from "../services/TokenService";

import TwoFactorRepository from "../repositories/TwoFactorRepository";
import User2FA from "../models/User2FA";
import passport from "passport";
import OAuthController from "../controllers/OAuthController";
import OAuthService from "../services/OAuthService";

const { OAUTH_CLIENTID, OAUTH_CLIENTSECRET } = process.env;
const router = Router();

const user2FARepository = new TwoFactorRepository(User2FA);
const tokenService = new TokenService();
const oAuthService = new OAuthService(
  OAUTH_CLIENTID!,
  OAUTH_CLIENTSECRET!,
  "/auth/google/callback"
);
const oAuthController = new OAuthController(
  tokenService,
  user2FARepository,
  oAuthService
);

router.get("/", passport.authenticate("google", { scope: ["profile"] }));

router.post(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  oAuthController.authenticateCallbackURL
);

export default router;
