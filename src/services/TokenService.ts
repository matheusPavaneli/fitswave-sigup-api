import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { SECRET } = process.env;

import ITokenService from "../interfaces/ITokenService";
import User from "../models/User";

class TokenService implements ITokenService {
  getLoginToken = (
    id: number,
    username: string,
    email: string,
    twoFactorStatus: boolean
  ): string => {
    return jwt.sign(
      { id, username, email, twoFactorStatus },
      SECRET ?? "default"
    );
  };

  getResetPasswordToken = (email: string): string => {
    return jwt.sign({ email }, SECRET ?? "default", { expiresIn: "30m" });
  };

  decodeToken = (token: string): string | jwt.JwtPayload | null => {
    return jwt.decode(token);
  };
}

export default TokenService;
