import bcrypt from 'bcryptjs';

import { BadRequestError, ConflictError } from '../helpers/ApiError';
import IAuthService from '../interfaces/IAuthService';
import type IResetPasswordData from '../interfaces/IResetPasswordData';
import IUserLoginData from '../interfaces/IUserLoginData';
import IUserRepository from '../interfaces/IUserRepository';
import User from '../models/User';

class AuthService implements IAuthService {
  private UserRepository: IUserRepository;

  constructor(UserRepository: IUserRepository) {
    this.UserRepository = UserRepository;
  }

  authenticate = async ({
    identifier,
    password,
  }: IUserLoginData): Promise<User | null> => {
    const user = await this.UserRepository.findUserByIdentifier(identifier);

    if (!user) {
      throw new BadRequestError('Invalid credentials!');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new BadRequestError('Invalid credentials!');
    }

    return user;
  };

  resetPassword = async ({
    email,
    newPassword,
  }: IResetPasswordData): Promise<User> => {
    const user = await this.UserRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('No users could be found.');
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      throw new ConflictError(
        'Your new password cannot be the same as your old one.',
      );
    }

    user.password = newPassword;
    await user.save();
    return user;
  };
}

export default AuthService;
