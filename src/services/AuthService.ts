import { BadRequestError } from '../helpers/apiError';
import IAuthService from '../interfaces/IAuthService';
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
    const user =
      (await this.UserRepository.findUserByEmail(identifier)) ??
      (await this.UserRepository.findUserByUsername(identifier));

    if (!user) {
      throw new BadRequestError('Credenciais inválidas!');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new BadRequestError('Credenciais inválidas!');
    }

    return user;
  };
}

export default AuthService;
