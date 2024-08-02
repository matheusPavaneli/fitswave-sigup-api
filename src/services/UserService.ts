import bcrypt from 'bcryptjs';

import IUserCreationData from '../interfaces/IUserCreationData';
import IUserRepository from '../interfaces/IUserRepository';
import IUserServiceClass from '../interfaces/IUserServiceClass';
import User from '../models/User';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from '../helpers/ApiError';
import type IUserUpdateData from '../interfaces/IUserUpdateData';
import type ITokenService from '../interfaces/ITokenService';
import type IConflictUser from '../interfaces/IConflictUser';

class UserService implements IUserServiceClass {
  private UserRepository: IUserRepository;
  private TokenService: ITokenService;

  constructor(UserRepository: IUserRepository, TokenService: ITokenService) {
    this.UserRepository = UserRepository;
    this.TokenService = TokenService;
  }

  create = async (data: IUserCreationData): Promise<User | null> => {
    const { username, email } = data;

    if (!username || !email) {
      throw new BadRequestError('Username and email are required.');
    }

    await this.checkForConflicts({
      username,
      email,
    });

    const user = await this.UserRepository.create(data);

    if (!user) {
      throw new InternalServerError(
        'Unable to create user due to an internal error.',
      );
    }

    return user;
  };

  update = async (
    token: string,
    updateData: IUserUpdateData,
  ): Promise<User | null> => {
    const decodedToken = this.TokenService.decodeToken(token);

    if (!decodedToken) {
      throw new BadRequestError('Invalid token.');
    }

    const { username: currentUsername = '', email: currentEmail = '' } =
      decodedToken as {
        username?: string;
        email?: string;
      };

    const user = await this.UserRepository.findUserByUsernameOrEmail({
      email: currentEmail,
      username: currentUsername,
    });

    if (!user) {
      throw new BadRequestError('Could not find any user!');
    }

    const searchChanges = async (): Promise<boolean> => {
      for (const key of Object.keys(updateData)) {
        const updateValue =
          updateData[key as keyof IUserUpdateData] ??
          user[key as keyof IUserUpdateData];
        const userValue = user[key as keyof IUserUpdateData];

        if (key === 'password') {
          const passwordToCheck = updateData[key as keyof IUserUpdateData];
          if (passwordToCheck && user.password) {
            const samePassword = await bcrypt.compare(
              passwordToCheck,
              user.password,
            );
            if (samePassword) {
              continue;
            }
          }
        }

        if (String(updateValue).trim() !== String(userValue).trim()) {
          return true;
        }
      }
      return false;
    };

    const hasChanges = await searchChanges();

    if (!hasChanges) {
      throw new BadRequestError(
        'No fields modified, user has not been changed.',
      );
    }

    const { username: newUsername, email: newEmail } = updateData;

    await this.checkForConflicts({
      username: newUsername ?? '',
      email: newEmail ?? '',
      currentUser: user,
    });

    const updatedUser = await this.UserRepository.updateUser(user, updateData);
    return updatedUser;
  };

  private async checkForConflicts(
    data: IConflictUser,
  ): Promise<ConflictError | void> {
    const { username, email, currentUser } = data;

    const foundUser = await this.UserRepository.findUserByUsernameOrEmail({
      username,
      email,
    });

    if (foundUser && (!currentUser || currentUser.id !== foundUser.id)) {
      const errorMessage =
        foundUser.username === username
          ? 'The username is already in use!'
          : 'The email is already in use!';
      throw new ConflictError(errorMessage);
    }
  }
}

export default UserService;
