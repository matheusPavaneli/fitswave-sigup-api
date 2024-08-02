export default interface IMailService {
  sendMailResetPassword(to: string, token: string): Promise<void>;
}
