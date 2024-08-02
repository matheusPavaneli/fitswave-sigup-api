import User from '../models/User';
import { JwtPayload } from 'jsonwebtoken';

export default interface ITokenService {
  getLoginToken(data: User): string;
  getResetPasswordToken(email: string): string;
  decodeToken(token: string): string | JwtPayload | null;
}
