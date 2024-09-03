import { Request, Response } from "express";

import IUserServiceClass from "../interfaces/IUserServiceClass";
import { NotFoundError, UnprocessableEntityError } from "../helpers/ApiError";
import IUserResponse from "../interfaces/IUserResponse";
import type ITokenService from "../interfaces/ITokenService";
import type IUser2FAService from "../interfaces/ITwoFactorService";
import type ITwoFactorRepository from "../interfaces/ITwoFactorRepository";

class UserController {
  private UserService: IUserServiceClass;
  private TokenService: ITokenService;
  private User2FAService: IUser2FAService;
  private User2FARepository: ITwoFactorRepository;

  constructor(
    UserService: IUserServiceClass,
    TokenService: ITokenService,
    User2FAService: IUser2FAService,
    User2FARepository: ITwoFactorRepository
  ) {
    this.UserService = UserService;
    this.TokenService = TokenService;
    this.User2FAService = User2FAService;
    this.User2FARepository = User2FARepository;
  }

  createUser = async (req: Request, res: Response) => {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    const newUser = await this.UserService.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      throw new UnprocessableEntityError(
        "Due to an internal error, registration was not possible."
      );
    }

    const responseData: IUserResponse = {
      status: "success",
      data: {
        statusCode: 201,
        message: "You have successfully registered!",
        user: newUser,
      },
    };

    res.status(201).json(responseData);
  };

  updateUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };
    const token = req.headers["authorization"]!.split(" ")[1];

    const updatedUser = await this.UserService.update(token, {
      email,
      password,
      username,
    });

    if (updatedUser) {
      const {
        id,
        username,
        email,
      }: { id: number; username: string; email: string } = updatedUser;

      const user2FA = await this.User2FARepository.findUser2FAByUserId(id);

      if (!user2FA) {
        throw new NotFoundError(
          "Unable to find two-factor verification status"
        );
      }

      const { is2FAEnabled } = user2FA;

      const token = this.TokenService.getLoginToken(
        id,
        username,
        email,
        is2FAEnabled
      );
      res.set("authorization", token);
    }

    const responseData: IUserResponse = {
      status: "success",
      data: {
        statusCode: 200,
        message: "Your information has been updated successfully!",
        user: updatedUser,
      },
    };

    res.status(200).json(responseData);
  };
}

export default UserController;
