import type IUser2FARepository from "../interfaces/IUser2FARepository";
import User2FA from "../models/User2FA";

class User2FARepository implements IUser2FARepository {
  private User2FAModel: typeof User2FA;

  constructor(User2FAModel: typeof User2FA) {
    this.User2FAModel = User2FAModel;
  }

  create = async (userId: number): Promise<User2FA> => {
    return this.User2FAModel.create({ userId });
  };

  findUser2FAByUserId = async (userId: number): Promise<User2FA | null> => {
    return this.User2FAModel.findOne({ where: { userId } });
  };

  toggle2FA = async (user2FA: User2FA): Promise<User2FA | null> => {
    user2FA.is2FAEnabled = !user2FA?.is2FAEnabled;
    await user2FA.save();

    return user2FA;
  };
}

export default User2FARepository;
