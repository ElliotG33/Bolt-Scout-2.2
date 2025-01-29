import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alert from '@/models/Alert';
import type { AlertParams } from '@/types/alerts';

export async function PUT(
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

    alert.active = !alert.active;
    await alert.save();
    return NextResponse.json(
      {
        message: 'Success',
        success: true,
        alert,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
