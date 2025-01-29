import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alert from '@/models/Alert';
import Subscription from '@/models/Subscription';
import type { AlertParams } from '@/types/alerts';

export async function GET(
  request: Request,
  { params }: { params: AlertParams }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = params;
    const alert = await Alert.findById(id);
    if (!alert) {
      return NextResponse.json(
        {
          message: 'Alert not found',
          success: false,
        },
        { status: 404 }
      );
    }

    const subscription = await Subscription.exists({
      userId: alert.userId,
      status: 'active',
    });

    return NextResponse.json(
      {
        message: 'Success.',
        success: true,
        alert,
        isPaidPlan: subscription ? true : false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
