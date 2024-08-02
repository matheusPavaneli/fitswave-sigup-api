import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail' as string,
  auth: {
    user: EMAIL_USER as string,
    pass: EMAIL_PASS as string,
  },
});

export default transporter;
