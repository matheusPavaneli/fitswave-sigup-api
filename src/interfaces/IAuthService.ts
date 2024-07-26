import User from '../models/User';
import IUserLoginData from './IUserLoginData';

export default interface IAuthService {
  authenticate(data: IUserLoginData): Promise<User | null>;
}
