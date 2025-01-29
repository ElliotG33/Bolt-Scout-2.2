import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alert from '@/models/Alert';
import type { AlertParams } from '@/types/alerts';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<AlertParams> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;
    const result = await Alert.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json(
        {
          message: 'Alert not found',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Alert deleted successfully.',
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
