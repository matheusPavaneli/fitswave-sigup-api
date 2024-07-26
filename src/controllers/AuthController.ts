import { Request, Response } from 'express';

import IAuthService from '../interfaces/IAuthService';
import IUserResponse from '../interfaces/IUserResponse';
import ITokenService from '../interfaces/ITokenService';
import { ConflictError } from '../helpers/apiError';

class AuthController {
  private AuthService: IAuthService;
  private TokenService: ITokenService;

  constructor(AuthService: IAuthService, TokenService: ITokenService) {
    this.AuthService = AuthService;
    this.TokenService = TokenService;
  }

  authenticate = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    const alreadyAuthenticated = req.headers['authorization'];

    if (alreadyAuthenticated) {
      throw new ConflictError('Você já está autenticado!');
    }

    const user = await this.AuthService.authenticate({
      identifier,
      password,
    });

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        user: user,
      },
    };

    if (user) {
      const token = this.TokenService.getToken(user);
      res.set('authorization', token);
    }

    res.status(200).json(responseData);
  };

  logout = async (req: Request, res: Response) => {
    res.removeHeader('authorization');

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
      },
    };

    res.status(200).json(responseData);
  };
}

export default AuthController;
