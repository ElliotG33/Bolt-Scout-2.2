import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getStripePriceId } from '@/lib/tiers';
import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await connectToDatabase();

    const reqBody = await req.json();
    const { planId } = reqBody;

    const userSession = await auth();
    if (!userSession) {
      console.log('User session not found.');
      return NextResponse.json(
        { error: 'User session not found.' },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(userSession.user.id);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found.');
      return NextResponse.json({ error: 'User not found.' }, { status: 401 });
    }

    // Check if the user already has a Stripe customer ID
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });

      // Save the customer ID to the user record
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const stripePriceId = getStripePriceId(planId);
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Stripe Plan Id Missing!' },
        { status: 500 }
      );
    }
    // Create a new Checkout session with the selected plan
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId, // Use the planId passed from the client
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}?subscription=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}`,
    });
    // Respond with the session ID to the client
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
