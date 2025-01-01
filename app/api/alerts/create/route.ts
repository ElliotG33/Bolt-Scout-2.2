import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import { auth } from '@/lib/auth';
import Alert from '@/models/Alert';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session: any = await auth();

    const reqBody = await request.json();
    const { keywords, email, frequency } = reqBody;
    const newAlert = new Alert({
      keywords,
      email,
      frequency,
      userId: session.user.id,
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
