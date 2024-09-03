import type { Optional } from "sequelize";
import type IUser2FAAttribute from "./ITwoFactorAttributes";

export default interface ITwoFactorCreation
  extends Optional<IUser2FAAttribute, "id" | "is2FAEnabled" | "secret32"> {}
