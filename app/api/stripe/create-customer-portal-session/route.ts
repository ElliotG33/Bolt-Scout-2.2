import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const userSession = await auth();
      if (!userSession) {
        return NextResponse.json(
          { error: 'User not logged i.' },
          { status: 404 }
        );
      }

      const userId = new mongoose.Types.ObjectId(userSession.user.id);
      // Fetch the user from your database
      const user = await User.findById(userId);
      if (!user || !user.stripeCustomerId) {
        return NextResponse.json(
          { error: 'Stripe customer not found' },
          { status: 404 }
        );
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}`,
      });
      return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error: any) {
      console.error('Error creating customer portal session:', error.message);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}
