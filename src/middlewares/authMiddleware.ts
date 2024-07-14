import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config;

import { ForbiddenError, UnauthorizedError } from '../helpers/apiError';

const { SECRET } = process.env;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers['authorization'] ?? '';

  if (!token) {
    new ForbiddenError('Nenhum token encontrado.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jwt.verify(token, SECRET!, (err, _decoded) => {
    if (err) {
      throw new UnauthorizedError('Falha na autenticação.');
    }

    next();
  });
};

export default authMiddleware;
