/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/apiError';

export const errorHandler = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    error: {
      statusCode,
      message,
    },
  });
};
