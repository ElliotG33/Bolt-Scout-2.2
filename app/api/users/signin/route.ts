import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (await bcrypt.compare(password, user.password)) {
      //create token
      const tokenData = {
        id: user._id,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(tokenData, process.env.AUTH_TOKEN_SECRET!, {
        expiresIn: '1d',
      });

      const response = NextResponse.json({
        message: 'Login successful',
        success: true,
      });

      response.cookies.set('token', token, { httpOnly: true });
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
