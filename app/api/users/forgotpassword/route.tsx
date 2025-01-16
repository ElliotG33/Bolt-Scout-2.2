import { NextRequest, NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';
import { sendMail } from '@/helpers/mailer';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();
    const { email } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: 'Reset link sent successfully.',
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
      message: 'Reset link sent successfully.',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
