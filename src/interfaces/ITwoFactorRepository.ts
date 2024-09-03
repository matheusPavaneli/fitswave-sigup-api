import type User2FA from "../models/User2FA";

export default interface ITwoFactorRepository {
  create(userId: number): Promise<User2FA>;
  setSecret32(user: User2FA, token: string): Promise<User2FA | null>;
  findUser2FAByUserId(userId: number): Promise<User2FA | null>;
  active2FA(user2FA: User2FA): Promise<User2FA | null>;
  deactivate2FA(user2FA: User2FA): Promise<User2FA | null>;
}
