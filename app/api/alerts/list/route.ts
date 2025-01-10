import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alerts, { IAlert } from '@/models/Alert';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const session: any = await auth();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const alerts: IAlert[] = await Alerts.find({
      userId,
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
