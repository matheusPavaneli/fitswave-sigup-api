import { Request, Response } from 'express';

import IUserServiceClass from '../interfaces/IUserServiceClass';
import { UnprocessableEntityError } from '../helpers/ApiError';
import IUserResponse from '../interfaces/IUserResponse';
import type ITokenService from '../interfaces/ITokenService';

class UserController {
  private UserService: IUserServiceClass;
  private TokenService: ITokenService;

  constructor(UserService: IUserServiceClass, TokenService: ITokenService) {
    this.UserService = UserService;
    this.TokenService = TokenService;
  }

  createUser = async (req: Request, res: Response) => {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    const newUser = await this.UserService.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      new UnprocessableEntityError(
        'Due to an internal error, registration was not possible.',
      );
    }

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 201,
        message: 'You have successfully registered!',
        user: newUser,
      },
    };

    res.status(201).json(responseData);
  };

  updateUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };
    const token = req.headers['authorization']!.split(' ')[1];

    const updatedUser = await this.UserService.update(token, {
      email,
      password,
      username,
    });

    if (updatedUser) {
      const token = this.TokenService.getLoginToken(updatedUser);
      res.set('authorization', token);
    }

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 200,
        message: 'Your information has been updated successfully!',
        user: updatedUser,
      },
    };

    res.status(200).json(responseData);
  };
}

export default UserController;
