import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { ForbiddenError, NotFoundError } from "../helpers/ApiError";

const { SECRET } = process.env;

const verifyTwoFactor = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const { verifyCode } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new NotFoundError("No authorization header found.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new NotFoundError("No token found.");
  }

  const { twoFactorStatus } = jwt.verify(token, SECRET ?? "default") as {
    twoFactorStatus?: boolean;
  };

  if (!verifyCode && twoFactorStatus) {
    throw new ForbiddenError("No verify code found.");
  }

  next();
};

export default verifyTwoFactor;
