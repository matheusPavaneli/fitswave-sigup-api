import User from '../models/User';
import IUserCreationData from './IUserCreationData';
import type IUserUpdateData from './IUserUpdateData';

export default interface IUserServiceClass {
  create(data: IUserCreationData): Promise<User | null>;
  update(token: string, updateData: IUserUpdateData): Promise<User | null>;
}
