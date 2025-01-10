'use server';

import mongoose from 'mongoose';
import { auth } from '../auth';
import UserSearch from '@/models/UserSearch';
import { connectToDatabase } from '../utils/mongodb';
import { NextResponse } from 'next/server';

export const logUserSearch = async ({
  keywords,
  secondaryKeywords,
  antiKeywords,
  timeFrame,
}: {
  keywords: string[];
  secondaryKeywords: string[];
  antiKeywords: string[];
  timeFrame: string;
}) => {
  try {
    await connectToDatabase();
    const session: any = await auth();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const userSearch = new UserSearch({
      keywords,
      secondaryKeywords,
      antiKeywords,
      timeFrame,
      userId,
    });

    await userSearch.save();
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const getUserMonthlySearchCount = async () => {
  try {
    await connectToDatabase();
    const session: any = await auth();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const startDate = new Date();
    startDate.setDate(1); // Set to the first day of the current month
    startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Set to the first day of the next month
    endDate.setDate(0); // Set to the last day of the current month
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    const searchCount = await UserSearch.countDocuments({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return searchCount;
  } catch (error) {
    console.error('Error getting user monthly search count:', error);
    throw error;
  }
};
