import { Op } from 'sequelize';
import IUserCreationData from '../interfaces/IUserCreationData';
import IUserRepository from '../interfaces/IUserRepository';
import type IUserUpdateData from '../interfaces/IUserUpdateData';
import User from '../models/User';

class UserRepository implements IUserRepository {
  private UserModel: typeof User;

  constructor(UserModel: typeof User) {
    this.UserModel = UserModel;
  }

  public create = async (data: IUserCreationData): Promise<User | null> => {
    return await this.UserModel.create(data);
  };

  public findUserByEmail = async (email: string): Promise<User | null> => {
    return await this.UserModel.findOne({ where: { email } });
  };

  public findUserByUsername = async (
    username: string,
  ): Promise<User | null> => {
    return await this.UserModel.findOne({ where: { username } });
  };

  public findUserById = async (id: number): Promise<User | null> => {
    return await this.UserModel.findByPk(id);
  };

  public updateUser = async (
    user: User,
    data: Partial<IUserUpdateData>,
  ): Promise<User | null> => {
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof IUserUpdateData;
      const value = data[typedKey];

      if (value !== undefined) {
        user[typedKey] = value as string;
      }
    });

    await user.save();
    return user;
  };

  async findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    return User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
  }
}

export default UserRepository;
