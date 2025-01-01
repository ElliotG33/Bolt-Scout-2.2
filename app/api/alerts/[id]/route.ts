import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/utils/mongodb';
import Alert from '@/models/Alert';

export async function DELETE(request: NextRequest) {
  if (request.method === 'DELETE') {
    try {
      await connectToDatabase();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
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
  } else {
    return NextResponse.json(
      { error: 'Only DELETE requests are allowed' },
      { status: 405 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
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

    return NextResponse.json(
      {
        message: 'Success.',
        success: true,
        alert,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
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
