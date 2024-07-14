import { Request, Response } from 'express';

import IUserServiceClass from '../interfaces/IUserServiceClass';
import { UnprocessableEntityError } from '../helpers/apiError';
import IUserResponse from '../interfaces/IUserResponse';

class RegisterController {
  private UserService: IUserServiceClass;

  constructor(UserService: IUserServiceClass) {
    this.UserService = UserService;
  }

  createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const newUser = await this.UserService.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      new UnprocessableEntityError('Não foi possível realizar o cadastro.');
    }

    const responseData: IUserResponse = {
      status: 'success',
      data: {
        statusCode: 201,
        user: newUser,
      },
    };

    res.status(201).json(responseData);
  };
}

export default RegisterController;
