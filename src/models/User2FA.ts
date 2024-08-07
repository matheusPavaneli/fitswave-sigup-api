import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelizeConfig";
import type IUser2FAAttribute from "../interfaces/IUser2FAAttributes";
import type User2FACreation from "../interfaces/IUser2FAModel";
import type IModels from "../interfaces/IModels";

class User2FA
  extends Model<IUser2FAAttribute, User2FACreation>
  implements IUser2FAAttribute
{
  public id!: number;
  public userId!: number;
  public is2FAEnabled!: boolean;

  static associate(models: IModels): void {
    User2FA.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

User2FA.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: {
        name: "unique_userId",
        msg: "There is already a record associated with this user.",
      },
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    is2FAEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User2FA",
    tableName: "user2fa",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User2FA;
