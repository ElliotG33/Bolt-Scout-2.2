import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/utils/mongodb';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PORT = process.env.SMTP_PORT;

export async function sendMail({ email, emailType, userId, baseUrl }: any) {
  await connectToDatabase();
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
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: 'info@scout-ai.org',
    to: email,
    subject: 'Reset Password',
    html: `<p>You have requested for password reset.</p><p>Click <a href="${baseUrl}/auth/resetpassword?token=${hashedToken}">here</a> to ${
      emailType === 'REST' ? 'reset your password.' : 'verify your email'
    }</p>`,
  };

  const emailResponse = await transport.sendMail(mailOptions);
  return emailResponse;
}
