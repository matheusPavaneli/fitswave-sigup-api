import User from "../models/User";
import { JwtPayload } from "jsonwebtoken";

export default interface ITokenService {
  getLoginToken(
    id: number,
    username: string,
    email: string,
    twoFactorStatus: boolean
  ): string;
  getResetPasswordToken(email: string): string;
  decodeToken(token: string): string | JwtPayload | null;
}
