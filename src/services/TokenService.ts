import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { SECRET } = process.env;

import ITokenService from '../interfaces/ITokenService';
import User from '../models/User';

class TokenService implements ITokenService {
  private jwtLibrary: typeof jwt;

  constructor(jwtLib: typeof jwt) {
    this.jwtLibrary = jwtLib;
  }

  getToken(data: User): string {
    const { username, email } = data;

    return this.jwtLibrary.sign({ username, email }, SECRET ?? 'default');
  }
}

export default TokenService;
