import IUserCreationData from '../interfaces/IUserCreationData';
import IUserRepository from '../interfaces/IUserRepository';
import User from '../models/User';

class UserRepository implements IUserRepository {
  private UserModel: typeof User;

  constructor(UserModel: typeof User) {
    this.UserModel = UserModel;
  }

  public create = async (data: IUserCreationData): Promise<User> => {
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
}

export default UserRepository;
