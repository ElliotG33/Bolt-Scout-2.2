// app/types/next-auth.d.ts
import NextAuth from 'next-auth';
import { ObjectId } from 'mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      _id: ObjectId; // Assuming you're using MongoDB's ObjectId
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    _id: ObjectId; // Ensure the user object has an '_id' field
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
