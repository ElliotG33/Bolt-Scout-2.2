import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

const EMAIL_SERVICE_PROVIDER = process.env.EMAIL_SERVICE_PROVIDER;
const EMAIL_APP_USER = process.env.EMAIL_APP_USER;
const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS;

export async function sendMail({ email, emailType, userId, baseUrl }: any) {
  const hashedToken = await bcrypt.hash(userId.toString(), 10);
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 3600000); // 1 hour from now

  try {
    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: expiryTime,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }

  const transport = nodemailer.createTransport({
    service: EMAIL_SERVICE_PROVIDER,
    auth: {
      user: EMAIL_APP_USER,
      pass: EMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_APP_USER,
    to: email,
    subject: 'Reset Password',
    html: `<p>You have requested for password reset.</p><p>Click <a href="${baseUrl}/auth/resetpassword?token=${hashedToken}">here</a> to ${
      emailType === 'REST' ? 'reset your password.' : 'verify your email'
    }</p>`,
  };

  const emailResponse = await transport.sendMail(mailOptions);
  return emailResponse;
}
