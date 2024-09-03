import "express-async-errors";
import express, { Application } from "express";
import dotenv from "dotenv";
import passport from "passport";

import { errorHandler } from "./middlewares/errorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import twoFactorRoutes from "./routes/twoFactorRoutes";
import OAuthRoutes from "./routes/OAuthRoutes";

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  middlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(passport.initialize());
  }

  routes(): void {
    this.app.use("/user", userRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/2fa", twoFactorRoutes);
    this.app.use("/auth/google", OAuthRoutes);
  }

  errorHandler(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
