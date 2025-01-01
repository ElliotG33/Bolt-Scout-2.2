'use server';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/utils/mongodb';
import bcryptjs from 'bcryptjs';

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
