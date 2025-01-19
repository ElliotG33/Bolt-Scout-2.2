import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/utils/mongodb';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();
    const { name, email, password } = reqBody;

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 400 }
      );
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    const dbUser = await newUser.save();
    // Attempt to search for an existing customer with the user's email
    const existingCustomer = await stripe.customers.list({
      email: dbUser.email,
      limit: 1, // Only retrieve the first customer matching the email
    });

    if (existingCustomer.data.length > 0) {
      dbUser.stripeCustomerId = existingCustomer.data[0].id;
    } else {
      // No existing customer found, create a new one
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          userId: dbUser._id.toString(),
        },
      });
      dbUser.stripeCustomerId = customer.id;
    }

    await dbUser.save();

    return NextResponse.json({
      message: 'User registered successfully.',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
