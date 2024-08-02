import User from '../models/User';
import type IResetPasswordData from './IResetPasswordData';
import IUserLoginData from './IUserLoginData';

export default interface IAuthService {
  authenticate(data: IUserLoginData): Promise<User | null>;
  resetPassword(data: IResetPasswordData): Promise<User>;
}
