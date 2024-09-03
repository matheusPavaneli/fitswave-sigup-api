import { Request, Response } from "express";

import IUserServiceClass from "../interfaces/IUserServiceClass";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "../helpers/ApiError";
import IUserResponse from "../interfaces/IUserResponse";
import type ITokenService from "../interfaces/ITokenService";
import type IUser2FAService from "../interfaces/ITwoFactorService";
import type ITwoFactorResponse from "../interfaces/ITwoFactorResponse";
import type ISpeakeasyService from "../interfaces/ISpeakeasyService";

class TwoFactorController {
  private TokenService: ITokenService;
  private User2FAService: IUser2FAService;
  private SpeakeasyService: ISpeakeasyService;

  constructor(
    TokenService: ITokenService,
    User2FAService: IUser2FAService,
    SpeakeasyService: ISpeakeasyService
  ) {
    this.TokenService = TokenService;
    this.User2FAService = User2FAService;
    this.SpeakeasyService = SpeakeasyService;
  }

  setup = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]!.split(" ")[1];

    if (!token) {
      throw new NotFoundError("Unable to obtain authentication token");
    }

    const decodedToken = decodeURIComponent(token);

    const { id, email } = this.TokenService.decodeToken(decodedToken) as {
      id?: number;
      email: string;
    };

    if (!id) {
      throw new NotFoundError("Unable to obtain user ID");
    }

    await this.User2FAService.create(id);
    const user2FA = await this.User2FAService.setup(id);

    if (!user2FA) { 
      throw new NotFoundError("Unable to obtain user's two-factor")
    }

    const { secret32 } = user2FA;

    if (!secret32) {
      throw new NotFoundError("Unable to obtain user's two-factor token");
    }

    const qrCodeUrl = await this.SpeakeasyService.getQRCodeUrl(secret32, email);

    const responseData: ITwoFactorResponse = {
      status: "success",
      data: {
        statusCode: 200,
        data: qrCodeUrl,
      },
    };

    res.status(200).json(responseData);
  };

  activate = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]!.split(" ")[1];

    if (!token) {
      throw new NotFoundError("Unable to obtain authentication token");
    }

    const decodedToken = decodeURIComponent(token);

    const { id } = this.TokenService.decodeToken(decodedToken) as {
      id?: number;
    };

    if (!id) {
      throw new NotFoundError("Unable to obtain user ID");
    }

    await this.User2FAService.active2FA(id);

    const responseData: ITwoFactorResponse = {
      status: "success",
      data: {
        statusCode: 200,
        message: "You have successfully activated your two-step verification",
      },
    };

    res.status(200).json(responseData);
  };

  deactivate = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]!.split(" ")[1];

    if (!token) {
      throw new NotFoundError("Unable to obtain authentication token");
    }

    const decodedToken = decodeURIComponent(token);

    const { id } = this.TokenService.decodeToken(decodedToken) as {
      id?: number;
    };

    if (!id) {
      throw new NotFoundError("Unable to obtain user ID");
    }

    await this.User2FAService.deactivate2FA(id);

    const responseData: ITwoFactorResponse = {
      status: "success",
      data: {
        statusCode: 200,
        message: "You have successfully deactivated your two-step verification",
      },
    };

    res.status(200).json(responseData);
  };

  verify = async (req: Request, res: Response) => {
    const { verifyCode }: { verifyCode: string } = req.body;
    const token = req.headers["authorization"]!.split(" ")[1];

    if (!token) {
      throw new NotFoundError("Unable to obtain authentication token");
    }

    const decodedToken = decodeURIComponent(token);

    const { id } = this.TokenService.decodeToken(decodedToken) as {
      id?: number;
    };

    if (!id) {
      throw new NotFoundError("Unable to obtain user ID");
    }

    const validCode = await this.User2FAService.verify2FA(id, verifyCode);

    if (!validCode) {
      throw new UnauthorizedError(
        "The 2FA code you entered is incorrect or expired."
      );
    }

    const responseData: ITwoFactorResponse = {
      status: "success",
      data: {
        statusCode: 200,
        message: "You have been successfully verified!",
      },
    };

    res.status(200).json(responseData);
  };
}

export default TwoFactorController;
