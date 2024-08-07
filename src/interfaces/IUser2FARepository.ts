import type User2FA from "../models/User2FA";

export default interface IUser2FARepository {
  create(userId: number): Promise<User2FA>;
  findUser2FAByUserId(userId: number): Promise<User2FA | null>;
  toggle2FA(user2FA: User2FA): Promise<User2FA | null>;
}
