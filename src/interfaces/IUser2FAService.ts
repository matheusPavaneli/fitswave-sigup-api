import type User2FA from "../models/User2FA";

export default interface IUser2FAService {
  create(userId: number): Promise<User2FA | null>;
  toggle2FA(userId: number): Promise<User2FA | null>;
}
