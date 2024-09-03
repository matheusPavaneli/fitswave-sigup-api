import type ITwoFactorRepository from "../interfaces/ITwoFactorRepository";
import User2FA from "../models/User2FA";

class TwoFactorRepository implements ITwoFactorRepository {
  private User2FAModel: typeof User2FA;

  constructor(User2FAModel: typeof User2FA) {
    this.User2FAModel = User2FAModel;
  }

  create = async (userId: number): Promise<User2FA> => {
    return this.User2FAModel.create({ userId });
  };

  setSecret32 = async (
    user: User2FA,
    token: string
  ): Promise<User2FA | null> => {
    user.secret32 = token;
    await user.save();
    return user;
  };

  findUser2FAByUserId = async (userId: number): Promise<User2FA | null> => {
    return this.User2FAModel.findOne({ where: { userId } });
  };

  active2FA = async (user2FA: User2FA): Promise<User2FA | null> => {
    user2FA.is2FAEnabled = true;
    await user2FA.save();

    return user2FA;
  };

  deactivate2FA = async (user2FA: User2FA): Promise<User2FA | null> => {
    user2FA.is2FAEnabled = false;
    await user2FA.save();

    return user2FA;
  };
}

export default TwoFactorRepository;
