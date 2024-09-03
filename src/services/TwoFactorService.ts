import dotenv from "dotenv";
dotenv.config();

import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/ApiError";
import type ISpeakeasyService from "../interfaces/ISpeakeasyService";
import type ITwoFactorRepository from "../interfaces/ITwoFactorRepository";
import type ITwoFactorService from "../interfaces/ITwoFactorService";
import type User2FA from "../models/User2FA";

const SECRET_2FA: string = process.env.SECRET_2FA!;

class TwoFactorService implements ITwoFactorService {
  private TwoFactorRepository: ITwoFactorRepository;
  private SpeakeasyService: ISpeakeasyService;

  constructor(
    TwoFactorRepository: ITwoFactorRepository,
    SpeakeasyService: ISpeakeasyService
  ) {
    this.TwoFactorRepository = TwoFactorRepository;
    this.SpeakeasyService = SpeakeasyService;
  }

  create = async (userId: number): Promise<User2FA | null> => {
    const user = await this.TwoFactorRepository.findUser2FAByUserId(userId);

    if (!user) {
      const newUser = await this.TwoFactorRepository.create(userId);

      if (!newUser) {
        throw new InternalServerError(
          "Unable to create two-factor record for user"
        );
      }

      return newUser;
    }

    return user;
  };

  setup = async (userId: number): Promise<User2FA | null> => {
    const user = await this.TwoFactorRepository.findUser2FAByUserId(userId);

    if (!user) {
      throw new NotFoundError("Unable to find a user.");
    }

    const secret32 = this.SpeakeasyService.generateSecret().base32;
    const user2FA = await this.TwoFactorRepository.setSecret32(user, secret32);

    if (!user2FA) {
      throw new InternalServerError("Unable to create 2FA record for user");
    }

    return user2FA;
  };

  active2FA = async (userId: number): Promise<string | null> => {
    const existsUser2FA =
      await this.TwoFactorRepository.findUser2FAByUserId(userId);

    if (!existsUser2FA) {
      throw new BadRequestError(
        "No two-step verification records were found for this user"
      );
    }

    const toggledUser = await this.TwoFactorRepository.active2FA(existsUser2FA);

    if (!toggledUser) {
      throw new InternalServerError(
        "Unable to change two-step verification status"
      );
    }

    const secret32 = toggledUser.secret32;

    return secret32;
  };

  deactivate2FA = async (userId: number): Promise<User2FA | null> => {
    const existsUser2FA =
      await this.TwoFactorRepository.findUser2FAByUserId(userId);

    if (!existsUser2FA) {
      throw new BadRequestError(
        "No two-step verification records were found for this user"
      );
    }

    const toggledUser =
      await this.TwoFactorRepository.deactivate2FA(existsUser2FA);

    if (!toggledUser) {
      throw new InternalServerError(
        "Unable to change two-step verification status"
      );
    }

    return toggledUser;
  };

  verify2FA = async (userId: number, verifyCode: string): Promise<boolean> => {
    const existsUser2FA =
      await this.TwoFactorRepository.findUser2FAByUserId(userId);

    if (!existsUser2FA) {
      throw new BadRequestError(
        "No two-step verification records were found for this user"
      );
    }

    const { secret32 }: { secret32: string } = existsUser2FA;

    const verifiedUser = this.SpeakeasyService.verifyToken(
      secret32,
      verifyCode
    );

    return verifiedUser;
  };
}

export default TwoFactorService;
