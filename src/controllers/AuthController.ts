import { Request, Response } from 'express';

import IAuthService from '../interfaces/IAuthService';
import IUserResponse from '../interfaces/IUserResponse';
import ITokenService from '../interfaces/ITokenService';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from '../helpers/ApiError';
import type IMailService from '../interfaces/IMailService';

class AuthController {
  private AuthService: IAuthService;
  private TokenService: ITokenService;
  private MailService: IMailService;

  constructor(
    AuthService: IAuthService,
    TokenService: ITokenService,
    MailService: IMailService,
  ) {
    this.AuthService = AuthService;
    this.TokenService = TokenService;
    this.MailService = MailService;
  }

  authenticate = async (req: Request, res: Response): Promise<Response> => {
    const { identifier, password }: { identifier: string; password: string } =
      req.body;

    const alreadyAuthenticated = req.headers['authorization'];

    if (alreadyAuthenticated) {
      throw new ConflictError('You are now authenticated!');
    }

    const user = await this.AuthService.authenticate({
      identifier,
      password,
    });

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        message: 'You have successfully authenticated!',
        user: user,
      },
    };

    if (user) {
      const token = this.TokenService.getLoginToken(user);
      res.set('authorization', token);
    }

    return res.status(200).json(responseData);
  };

  logout = async (req: Request, res: Response) => {
    res.removeHeader('authorization');

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        message: 'You have successfully logged out!',
      },
    };

    res.status(200).json(responseData);
  };

  requestPasswordReset = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { email }: { email: string } = req.body;

    const token = this.TokenService.getResetPasswordToken(email);

    if (!token) {
      throw new InternalServerError('Unable to create a recovery token.');
    }

    await this.MailService.sendMailResetPassword(email, token);

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        message: 'If this email exists, we will send a recovery email!',
      },
    };

    return res.status(200).json(responseData);
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { newPassword }: { newPassword: string } = req.body;
    const { token } = req.query as { token: string };

    if (!token) {
      throw new BadRequestError('No tokens found');
    }

    const decodedToken = decodeURIComponent(token);

    const { email } = this.TokenService.decodeToken(decodedToken) as {
      email?: string;
    };

    if (!email) {
      throw new InternalServerError(
        'An error occurred while trying to locate the email',
      );
    }

    const user = await this.AuthService.resetPassword({ email, newPassword });

    if (!user) {
      throw new InternalServerError(
        'An error occurred when trying to update your password',
      );
    }

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        message: 'Your password has been changed successfully!',
      },
    };

    return res.status(200).json(responseData);
  };
}

export default AuthController;
