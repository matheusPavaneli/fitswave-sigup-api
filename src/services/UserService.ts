import { ValidationError } from 'sequelize';

import IUserCreationData from '../interfaces/IUserCreationData';
import IUserRepository from '../interfaces/IUserRepository';
import IUserServiceClass from '../interfaces/IUserServiceClass';
import User from '../models/User';
import { BadRequestError } from '../helpers/apiError';

class UserService implements IUserServiceClass {
  private UserRepository: IUserRepository;

  constructor(UserRepository: IUserRepository) {
    this.UserRepository = UserRepository;
  }

  create = async (data: IUserCreationData): Promise<User | void> => {
    try {
      return await this.UserRepository.create(data);
    } catch (err) {
      if (err instanceof ValidationError) {
        const errorMessages = err.errors
          .map((error) => error.message)
          .join(', ');
        throw new BadRequestError(errorMessages);
      }

      if (err instanceof Error) {
        throw new BadRequestError(err.message);
      }
    }
  };
}

export default UserService;
