import type { Optional } from "sequelize";
import type IUser2FAAttribute from "./IUser2FAAttributes";

export default interface User2FACreation
  extends Optional<IUser2FAAttribute, "id" | "is2FAEnabled"> {}
