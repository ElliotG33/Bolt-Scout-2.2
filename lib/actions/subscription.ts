'use server';

import mongoose from 'mongoose';
import { auth } from '../auth';
import { connectToDatabase } from '../utils/mongodb';
import { NextResponse } from 'next/server';
import Subscription from '@/models/Subscription';
import { plans } from '../plans';
import UserSearch from '@/models/UserSearch';
import Alert from '@/models/Alert';

interface UserSubscriptionData {
  planDetails: {
    price: number;
    search_limit: number;
    custom_alert_limit: number;
    platform: string[];
  };
  searchCount: number;
  alertCount: number;
}

export async function createSubscription({
  planId,
  startDate,
}: {
  planId: string;
  startDate: Date;
}) {
  try {
    await connectToDatabase();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const newSubscription = new Subscription({
      userId,
      planId,
      startDate,
    });

    await newSubscription.save();

    return NextResponse.json({ message: 'Subscription created successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function getSubscriptionData(id?: string) {
  let userId;
  let session;
  try {
    if (!id) {
      await connectToDatabase();
      session = await auth();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = new mongoose.Types.ObjectId(session.user.id);
    } else {
      userId = id;
    }

    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
    }).populate('planId');

    if (!subscription) {
      return null;
    }

    const { planId, startDate, endDate } = subscription;
    const planDetails = plans[planId];

    // const startDate = new Date();
    // startDate.setDate(1); // Set to the first day of the current month
    // startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // const endDate = new Date();
    // endDate.setMonth(endDate.getMonth() + 1); // Set to the first day of the next month
    // endDate.setDate(0); // Set to the last day of the current month
    // endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    const searchCount = await UserSearch.countDocuments({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const alertCount = await Alert.countDocuments({
      userId,
      active: true,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const subscriptionData: any = {
      ...subscription.toObject(),
      planDetails,
      searchCount,
      alertCount,
    };

    if (session) {
      // Cache subscription details in the session (if available)
      session.subscription = subscriptionData;
    }

    return subscriptionData;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
}
