import User from '../models/User';
import IUserCreationData from './IUserCreationData';
import type IUserUpdateData from './IUserUpdateData';

export default interface IUserRepository {
  create(data: IUserCreationData): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(id: number): Promise<User | null>;
  updateUser(user: User, data: IUserUpdateData): Promise<User | null>;
  findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null>;
  findUserByIdentifier(identifier: string): Promise<User | null>;
}
