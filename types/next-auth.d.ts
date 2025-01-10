// app/types/next-auth.d.ts
import NextAuth from 'next-auth';
import { ObjectId } from 'mongodb';
import { ISubscription } from '@/models/Subscription';

declare module 'next-auth' {
  interface UserSubscriptionData {
    _id: ObjectId;
    userId: ObjectId;
    planId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    planDetails: {
      price: number;
      search_limit: number;
      custom_alert_limit: number;
      platform: string[];
    };
    searchCount: number;
    alertCount: number;
  }
  interface Session {
    user: {
      id: string;
      _id: ObjectId; // Assuming you're using MongoDB's ObjectId
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    subscription: boolean;
  }

  interface User {
    id: string;
    _id: ObjectId; // Ensure the user object has an '_id' field
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
