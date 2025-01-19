import { loginUser } from '@/lib/actions/user';
import type { NextAuthOptions, User as IUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/utils/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { stripe } from '@/lib/stripe';
interface ExtendedUser extends IUser {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      //@ts-ignore
      async authorize(credentials) {
        const user = credentials as {
          email: string;
          password: string;
        };
        try {
          const response = await loginUser(user.email, user.password);
          const loggedInUser = response.data;
          if (loggedInUser && response.error === null) {
            return {
              id: loggedInUser._id,
              name: loggedInUser.name,
              email: loggedInUser.email,
              // role: loggedInUser.role,
            };
          } else {
            throw new Error(response.error);
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDatabase();

        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const dbUser = await User.create({
            name: user.name,
            email: user.email,
            password: account?.id_token || user.id,
          });

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
        }
      } catch (error) {
        console.log(error);
      }
      return true;
    },
    async jwt({ token, user }) {
      const ExtendUser: ExtendedUser = user;
      if (ExtendUser) token.role = ExtendUser.role;
      try {
        const foundUser = await User.findOne({
          email: token.email,
        });
        if (foundUser) {
          token.id = foundUser._id.toString();
          // session.user.role = foundUser.role;
        }
      } catch (error) {
        console.log(error);
      }
      return token;
    },
    async session({ session }) {
      if (session?.user) {
        try {
          const foundUser = await User.findOne({
            email: session.user.email,
          });
          if (foundUser) {
            session.user.id = foundUser._id.toString();
            // session.user.role = foundUser.role;
            const subscription = await Subscription.exists({
              userId: session.user.id,
              status: 'active',
            });
            session.subscription = subscription ? true : false;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; //Redirect to the home page after sign-in
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/',
  },
};
