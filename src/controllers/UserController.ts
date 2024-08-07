import { Request, Response } from "express";

import IUserServiceClass from "../interfaces/IUserServiceClass";
import { UnprocessableEntityError } from "../helpers/ApiError";
import IUserResponse from "../interfaces/IUserResponse";
import type ITokenService from "../interfaces/ITokenService";
import type IUser2FAService from "../interfaces/IUser2FAService";

class UserController {
  private UserService: IUserServiceClass;
  private TokenService: ITokenService;
  private User2FAService: IUser2FAService;

  constructor(
    UserService: IUserServiceClass,
    TokenService: ITokenService,
    User2FAService: IUser2FAService
  ) {
    this.UserService = UserService;
    this.TokenService = TokenService;
    this.User2FAService = User2FAService;
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

    const { id }: { id: number } = newUser;

    await this.User2FAService.create(id);

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
      const token = this.TokenService.getLoginToken(updatedUser);
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
