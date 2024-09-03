import User from "../models/User";

export default interface IUserResponse {
  status: string;
  data: {
    statusCode: number;
    message?: string;
    user?: Partial<User | void | null>;
  };
}
