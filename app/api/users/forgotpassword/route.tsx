import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: 'Rest link sent successfully.',
        success: true,
      });
    }

    sendMail({
      email: user.email,
      emailType: 'REST',
      userId: user._id,
      baseUrl: request.nextUrl.origin,
    });

    return NextResponse.json({
      message: 'Rest link sent successfully.',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
