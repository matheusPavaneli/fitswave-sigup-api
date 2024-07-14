import User from '../models/User';
import IUserLoginData from './IUserLoginData';

export default interface IAuthService {
  authenticate(data: IUserLoginData): Promise<User | null>;
  resetPassword(
    identifier: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User>;
}
