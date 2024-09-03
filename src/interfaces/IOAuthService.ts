import type { Profile } from "passport";
import type IUserOAuth from "./IUserOAuth";

export default interface IOAuthService {
  configureStrategy(): Promise<void>;
  verifyCallback(
    _: string,
    __: string,
    profile: Profile,
    done: (error: any, user?: IUserOAuth | false) => void
  ): Promise<void>;
}
