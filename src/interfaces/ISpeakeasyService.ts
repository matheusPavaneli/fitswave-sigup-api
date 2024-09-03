import type { GeneratedSecret } from "speakeasy";

export default interface ISpeakeasyService {
  generateSecret(): GeneratedSecret;
  verifyToken(secret: string, token: string): boolean;
  getQRCodeUrl(secret: string, userEmail: string): Promise<string>;
}
