import User from "../models/User";

export default interface ITwoFactorResponse {
  status: string;
  data: {
    statusCode: number;
    message?: string;
    data?: string;
  };
}
