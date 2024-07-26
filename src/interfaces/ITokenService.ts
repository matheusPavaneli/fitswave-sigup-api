import User from '../models/User';
import { JwtPayload } from 'jsonwebtoken';

export default interface ITokenService {
  getToken(data: User): string;
  decodeToken(token: string): string | JwtPayload | null;
}
