import { BadRequestError, InternalServerError } from "../helpers/ApiError";
import type IUser2FARepository from "../interfaces/IUser2FARepository";
import type IUser2FAService from "../interfaces/IUser2FAService";
import type User2FA from "../models/User2FA";

class User2FAService implements IUser2FAService {
  private User2FARepository: IUser2FARepository;

  constructor(User2FARepository: IUser2FARepository) {
    this.User2FARepository = User2FARepository;
  }

  create = async (userId: number): Promise<User2FA | null> => {
    const user2FA = this.User2FARepository.create(userId);

    if (!user2FA) {
      throw new InternalServerError("Unable to create 2FA record for user");
    }

    return user2FA;
  };

  toggle2FA = async (userId: number): Promise<User2FA | null> => {
    const existsUser2FA =
      await this.User2FARepository.findUser2FAByUserId(userId);

    if (!existsUser2FA) {
      throw new BadRequestError(
        "No two-step verification records were found for this user"
      );
    }

    const toggledUser = await this.User2FARepository.toggle2FA(existsUser2FA);

    if (!toggledUser) {
      throw new InternalServerError(
        "Unable to change two-step verification status"
      );
    }

    return toggledUser;
  };
}

export default User2FAService;
