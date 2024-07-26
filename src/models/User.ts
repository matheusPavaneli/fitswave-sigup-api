import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/sequelizeConfig';
import UserAttributes from '../interfaces/IUserAttributes';
import UserCreationAttributes from '../interfaces/IUserModel';

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  public comparePassword = async (
    candidatePassword: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(candidatePassword, this.password);
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: {
        name: 'unique_username',
        msg: 'Esse usuário já está registrado em nosso banco de dados',
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'unique_email',
        msg: 'Esse email já está registrado em nosso banco de dados',
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeSave: async (user: User): Promise<void> => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default User;
