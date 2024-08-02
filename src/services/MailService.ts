import type { SendMailOptions, Transporter } from 'nodemailer';
import EmailHelper from '../helpers/EmailHelper';
import dotenv from 'dotenv';
import type IMailService from '../interfaces/IMailService';
import { InternalServerError } from '../helpers/ApiError';
dotenv.config();

const { EMAIL_USER } = process.env;

class MailService implements IMailService {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  sendMailResetPassword = async (to: string, token: string): Promise<void> => {
    const mailOptions: SendMailOptions = {
      from: EMAIL_USER,
      to,
      subject: 'Redefine password',
      html: EmailHelper.getEmailResetPassword(token),
    };

    const emailSended = await this.transporter.sendMail(mailOptions);

    if (!emailSended) {
      throw new InternalServerError(
        'There was an error with our email sending server',
      );
    }

    return;
  };
}

export default MailService;
