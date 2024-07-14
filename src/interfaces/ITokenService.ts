import User from '../models/User';

export default interface ITokenService {
  getToken(data: User): string;
}
