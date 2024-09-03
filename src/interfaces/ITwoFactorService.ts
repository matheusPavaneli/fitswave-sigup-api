import type User2FA from "../models/User2FA";

export default interface ITwoFactorService {
  create(userId: number): Promise<User2FA | null>;
  setup(userId: number): Promise<User2FA | null>;
  active2FA(userId: number): Promise<string | null>;
  deactivate2FA(userId: number): Promise<User2FA | null>;
  verify2FA(userId: number, verifyCode: string): Promise<boolean>;
}
