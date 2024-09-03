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

const verifyTwoFactor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { verifyCode } = req.body;

  if (!verifyCode) {
    throw new NotFoundError("No verify code found.");
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new NotFoundError("No authorization header found.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new NotFoundError("No token found.");
  }

  const { is2FAEnabled } = jwt.verify(token, SECRET ?? "default") as {
    is2FAEnabled?: boolean;
  };

  if (is2FAEnabled) {
    throw new ForbiddenError("2FA verification required");
  }

  next();
};

export default verifyTwoFactor;
