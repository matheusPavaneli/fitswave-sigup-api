import User from '../models/User';
import IUserCreationData from './IUserCreationData';

export default interface IUserServiceClass {
  create(data: IUserCreationData): Promise<User | void>;
}
