import IUserCreationData from '../interfaces/IUserCreationData';
import IUserRepository from '../interfaces/IUserRepository';
import IUserServiceClass from '../interfaces/IUserServiceClass';
import User from '../models/User';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from '../helpers/apiError';
import type IUserUpdateData from '../interfaces/IUserUpdateData';
import type ITokenService from '../interfaces/ITokenService';

class UserService implements IUserServiceClass {
  private UserRepository: IUserRepository;
  private TokenService: ITokenService;

  constructor(UserRepository: IUserRepository, TokenService: ITokenService) {
    this.UserRepository = UserRepository;
    this.TokenService = TokenService;
  }

  create = async (data: IUserCreationData): Promise<User | null> => {
    const { username, email } = data;
    await this.checkForConflicts(username ?? '', email ?? '');

    const user = await this.UserRepository.create(data);

    if (!user) {
      throw new InternalServerError(
        'Não foi possível criar o usuário devido a um erro interno.',
      );
    }

    return user;
  };

  update = async (
    token: string,
    updateData: IUserUpdateData,
  ): Promise<User | null> => {
    const { username: currentUsername = '', email: currentEmail = '' } =
      this.TokenService.decodeToken(token) as {
        username?: string;
        email?: string;
      };

    const user = await this.UserRepository.findUserByUsernameOrEmail(
      currentUsername,
      currentEmail,
    );

    if (!user) {
      throw new BadRequestError('Não foi possível encontrar nenhum usuário!');
    }

    const hasChanges = Object.keys(updateData).some((key) => {
      const updateValue =
        updateData[key as keyof IUserUpdateData] ??
        user[key as keyof IUserUpdateData];
      const userValue = user[key as keyof IUserUpdateData];

      return String(updateValue).trim() !== String(userValue).trim();
    });

    if (!hasChanges) {
      throw new BadRequestError(
        'Nenhum campo modificado, o usuário não foi alterado.',
      );
    }

    const { username: newUsername, email: newEmail } = updateData;

    await this.checkForConflicts(newUsername ?? '', newEmail ?? '');

    const updatedUser = await this.UserRepository.updateUser(user, updateData);
    return updatedUser;
  };

  private async checkForConflicts(username: string, email: string) {
    const conflict = await this.UserRepository.findUserByUsernameOrEmail(
      username,
      email,
    );

    if (conflict) {
      const errorMessage = conflict.username
        ? 'O nome de usuário já está em uso!'
        : 'O e-mail já está em uso!';
      throw new ConflictError(errorMessage);
    }
  }
}

export default UserService;
