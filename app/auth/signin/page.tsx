'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

import { redirect, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isValidEmail } from '@/lib/utils/auth';

export default function SigninPage() {
  const { data: session } = useSession();
  if (session) {
    redirect('/');
  }

  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get('callbackUrl');
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      isValidEmail(user.email) &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = user;

    if (email && password) {
      const res = await signIn('credentials', {
        email: email,
        password: password,
        redirect: true,
        callbackUrl: '/',
      });
    }
  };

  return (
    <Card className='flex flex-col items-center justify-center min-h-screen py-12'>
      <CardContent className='pt-12 pb-12 space-y-12 rounded-lg shadow-lg w-full max-w-md border bg-card text-card-foreground'>
        <h1 className='text-3xl font-bold text-center mb-6'>Sign in</h1>

        <Button
          onClick={() => signIn('google')}
          variant='outline'
          className='gap-4 w-full flex items-center'
          size='lg'
        >
          Sign in with Google
          <Image
            src='/images/icons/google.svg'
            alt='Google'
            width={24}
            height={24}
          />
        </Button>

        <div className='text-center text-lg'>
          <p>OR</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col space-y-8'>
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
              type='submit'
              disabled={buttonDisabled || processing}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold tracking-wide focus:outline-none transition-all duration-300 ease-in-out ${
                buttonDisabled || processing
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {processing ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <Link href='/auth/forgotpassword'>
          <p className='text-center mt-4 text-sm hover:underline'>
            Forgot your password?
          </p>
        </Link>

        <Link href='/auth/signup'>
          <p className='text-center mt-4 text-sm hover:underline'>
            Don&apos;t have an account? Sign Up
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
