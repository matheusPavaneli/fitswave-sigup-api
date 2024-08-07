import type User from "../models/User";
import type User2FA from "../models/User2FA";

export default interface IModels {
  User: typeof User;
  User2FA: typeof User2FA;
}
