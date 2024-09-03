import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import type IUserOAuth from "../interfaces/IUserOAuth";
import type IOAuthService from "../interfaces/IOAuthService";

class OAuthService implements IOAuthService {
  private clientID: string;
  private clientSecret: string;
  private callbackURL: string;

  constructor(clientID: string, clientSecret: string, callbackURL: string) {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.callbackURL = callbackURL;
    this.configureStrategy();
  }

  configureStrategy = async (): Promise<void> => {
    passport.use(
      new GoogleStrategy(
        {
          clientID: this.clientID,
          clientSecret: this.clientSecret,
          callbackURL: this.callbackURL,
        },
        this.verifyCallback
      )
    );
  };

  verifyCallback = async (
    _: string,
    __: string,
    profile: Profile,
    done: (error: any, user?: IUserOAuth | false) => void
  ): Promise<void> => {
    try {
      const user: IUserOAuth = {
        id: Number(profile.id),
        displayName: profile.displayName,
        email: profile.emails?.[0].value || "",
      };

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  };
}

export default OAuthService;
