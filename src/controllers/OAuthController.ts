import { Request, Response } from "express";

import type IOAuthService from "../interfaces/IOAuthService";
import type ITokenService from "../interfaces/ITokenService";
import type ITwoFactorRepository from "../interfaces/ITwoFactorRepository";
import type IUserOAuth from "../interfaces/IUserOAuth";
import type IUserResponse from "../interfaces/IUserResponse";

class OAuthController {
  private TokenService: ITokenService;
  private User2FARepository: ITwoFactorRepository;
  private OAuthService: IOAuthService;

  constructor(
    TokenService: ITokenService,
    User2FARepository: ITwoFactorRepository,
    OAuthService: IOAuthService
  ) {
    this.TokenService = TokenService;
    this.User2FARepository = User2FARepository;
    this.OAuthService = OAuthService;
  }

  authenticateCallbackURL = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const {
      displayName,
      email,
      id,
    }: { displayName: string; email: string; id: number } =
      req.user as IUserOAuth;

    const formattedUsername = displayName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .toLocaleLowerCase()
      .trim();

    const { is2FAEnabled } = await this.User2FARepository.create(id);

    const token = this.TokenService.getLoginToken(
      id,
      formattedUsername,
      email,
      is2FAEnabled
    );

    res.set("authorization", token);

    const responseData: IUserResponse = {
      status: "success",
      data: {
        statusCode: 200,
        message: "You have successfully authenticated!",
      },
    };

    return res.status(200).json(responseData);
  };
}

export default OAuthController