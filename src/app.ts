import 'express-async-errors';
import express, { Application } from 'express';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';
import registerRoutes from './routes/registerRoutes';
import authRoutes from './routes/authRoutes';

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
  }

  routes(): void {
    this.app.use('/signup', registerRoutes);
    this.app.use('/auth', authRoutes);
  }

  errorHandler(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
