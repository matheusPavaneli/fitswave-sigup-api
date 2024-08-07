import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config;

import { ForbiddenError, UnauthorizedError } from '../helpers/ApiError';

const { SECRET } = process.env;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers['authorization'] ?? '';

  if (!token) {
    new ForbiddenError('No tokens found.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jwt.verify(token, SECRET!, (err, _decoded) => {
    if (err) {
      throw new UnauthorizedError('Authentication failed.');
    }

    next();
  });
};

export default authMiddleware;
