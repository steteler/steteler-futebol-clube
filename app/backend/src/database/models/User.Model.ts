import { Model, CreationOptional, DataTypes } from 'sequelize';
import IUser, { role } from '../../interfaces/IUser';
import sequelize from '.';

export default class User extends Model implements IUser {
  declare id: CreationOptional<number>;
  declare username: string;
  declare role: role;
  declare email: string;
  declare password: string;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
    timestamps: false,
    modelName: 'users',
    tableName: 'users',
    sequelize,
  },
);
