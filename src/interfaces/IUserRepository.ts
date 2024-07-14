import User from '../models/User';
import IUserCreationData from './IUserCreationData';

export default interface IUserRepository {
  create(data: IUserCreationData): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(id: number): Promise<User | null>;
}
