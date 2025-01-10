'use server';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/utils/mongodb';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';
import { auth } from '../auth';
import mongoose from 'mongoose';
import Subscription from '@/models/Subscription';

export const loginUser = async (email: string, password: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User Not Found.');
    }

    const isOk = await bcryptjs.compare(password, user.password);
    if (!isOk) {
      throw new Error('Invalid email or password');
    }
    return { data: user, error: null };
  } catch (error: any) {
    console.log('user', error.message);
    // handleError(error);
    return { data: null, error: error.message };
  }
};

export const createStripeCustomerIfNotExists = async (stripe: any) => {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session) {
      console.log('User session not found.');
      return null;
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found.');
      return null;
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
      stripeCustomerId = customer.id;
    }
    return stripeCustomerId;
  } catch (error: any) {
    console.log('error', error.message);
  }
};
