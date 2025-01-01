'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';

import axios from 'axios';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function SignupPage() {
  const { data: session } = useSession();
  if (session) {
    redirect('/');
  }

  const router = useRouter();

  const [user, setUser] = React.useState({
    email: '',
    password: '',
    name: '',
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const userdata = await axios.post('/api/users/signup', user);
      toast({
        title: userdata.data.message,
        variant: 'default',
      });
      // add 3 seconds delay
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error: any) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.name.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <Card className='flex flex-col items-center justify-center min-h-screen py-12'>
      <CardContent className='pt-12 pb-12 space-y-12 rounded-lg shadow-lg w-full max-w-md border bg-card text-card-foreground'>
        <h1 className='text-3xl font-bold text-center mb-'>Sign Up</h1>

        <div className='space-y-4'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            type='text'
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder='Enter your name'
            required
          />
        </div>
        <div className='space-y-4'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder='Enter your email address'
            required
          />
        </div>
        <div className='space-y-4'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder='Enter your password'
            required
          />
        </div>

        <div className='flex'>
          <Button
            onClick={onSignup}
            disabled={buttonDisabled}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold tracking-wide focus:outline-none transition-all duration-300 ease-in-out ${
              buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </div>

        <Link href='/auth/signin'>
          <p className='text-center hover:underline mt-6 text-sm'>
            Already have an account? Sign in
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
