import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const reqBody = await req.json();
    const { token, password } = reqBody;
    const currentTime = new Date(); // Current time

    // Find the user with the token and ensure the token is still valid (not expired)
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: currentTime }, // Check if verifyTokenExpiry is greater than currentTime
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's verification status
    user.password = hashedPassword;
    user.forgotPasswordToken = '';
    user.forgotPasswordTokenExpiry = '';
    await user.save();

    return NextResponse.json({
      message: 'Password Rest Successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
