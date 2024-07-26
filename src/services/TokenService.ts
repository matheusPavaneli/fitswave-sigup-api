import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { SECRET } = process.env;

import ITokenService from '../interfaces/ITokenService';
import User from '../models/User';

class TokenService implements ITokenService {
  getToken(data: User): string {
    const { username, email } = data;

    return jwt.sign({ username, email }, SECRET ?? 'default');
  }

  decodeToken(token: string): string | jwt.JwtPayload | null {
    return jwt.decode(token);
  }
}

export default TokenService;
