import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alerts, { IAlert } from '@/models/Alert';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const session: any = await auth();
    const alerts: IAlert[] = await Alerts.find({
      userId: session.user.id,
    });
    return NextResponse.json({
      message: 'success',
      success: true,
      alerts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
