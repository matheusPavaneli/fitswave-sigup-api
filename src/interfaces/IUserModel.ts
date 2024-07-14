import { Optional } from 'sequelize';

import UserAttributes from './IUserAttributes';

export default interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}
