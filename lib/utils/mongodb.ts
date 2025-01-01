import mongoose from 'mongoose';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI as string; // Ensure MONGO_URI is defined

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: mongoose.Connection | null = null;

// MongoDB connection for NextAuth using MongoClient
export async function connectToMongoClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    // Establish MongoClient connection for NextAuth
    const client = await MongoClient.connect(uri);
    // Cache the client to avoid reconnecting
    cachedClient = client;
    return cachedClient;
  } catch (error: any) {
    throw new Error('Failed to connect to database: ' + error.message);
  }
}

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(uri);
    cachedDb = conn.connection;
    return cachedDb;
  } catch (error: any) {
    throw new Error('Failed to connect to database: ' + error.message);
  }
}
