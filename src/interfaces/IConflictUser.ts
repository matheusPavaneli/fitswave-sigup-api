import type User from '../models/User';

export default interface IConflictUser {
  username: string;
  email: string;
  currentUser?: User;
}
