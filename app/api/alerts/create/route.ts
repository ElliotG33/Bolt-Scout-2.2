import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import { auth } from '@/lib/auth';
import Alert from '@/models/Alert';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session: any = await auth();

    const reqBody = await request.json();
    const { keywords, email, frequency } = reqBody;
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const newAlert = new Alert({
      keywords,
      email,
      frequency,
      userId,
    });

    const alert = await newAlert.save();

    return NextResponse.json({
      message: 'Alerts created successfully.',
      success: true,
      alert,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
