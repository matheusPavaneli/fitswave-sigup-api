import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/ApiError";

const { SECRET } = process.env;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new NotFoundError("No authorization header found.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new NotFoundError("No token found.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jwt.verify(token, SECRET!, (err, _decoded) => {
    if (err) {
      throw new UnauthorizedError("Authentication failed.");
    }

    next();
  });
};

export default authMiddleware;
