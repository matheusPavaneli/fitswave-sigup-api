import speakeasy, { type GeneratedSecret } from "speakeasy";
import type ISpeakeasyService from "../interfaces/ISpeakeasyService";

class SpeakeasyService implements ISpeakeasyService {
  private SpeakeasyService: typeof speakeasy;

  constructor(SpeakeasyService: typeof speakeasy) {
    this.SpeakeasyService = SpeakeasyService;
  }

  generateSecret = (): GeneratedSecret => {
    return this.SpeakeasyService.generateSecret({ name: "fitwave-sigup" });
  };

  verifyToken = (secret: string, token: string): boolean => {
    return this.SpeakeasyService.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 1,
    });
  };

  getQRCodeUrl = async (secret: string, userEmail: string): Promise<string> => {
    return this.SpeakeasyService.otpauthURL({
      secret,
      label: userEmail,
      issuer: "fitwave-sigup",
      encoding: "base32",
    });
  };
}

export default SpeakeasyService;
