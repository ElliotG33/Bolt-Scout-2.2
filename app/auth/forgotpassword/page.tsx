'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidEmail } from '@/lib/utils/auth';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function ForgetPasswordPage() {
  const { data: session } = useSession();
  if (session) {
    redirect('/');
  }
  const [email, setEmail] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (email.length > 0 && isValidEmail(email)) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/users/forgotpassword', { email });
      toast({
        title: res.data.message,
        variant: 'default',
      });
    } catch (error: any) {
      if (error.response) {
        toast({
          title: error.response.data.error || 'An error occurred',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'An error occurred',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className='flex flex-col items-center justify-center min-h-screen py-12'>
      <CardContent className='pt-12 pb-12 space-y-12 rounded-lg shadow-lg w-full max-w-md border bg-card text-card-foreground'>
        <h1 className='text-3xl font-bold text-center mb-6'>Forgot Password</h1>
        <div className='space-y-4'>
          <Label htmlFor='email'>Enter your email to reset your password</Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email address'
            required
          />
        </div>

        <div className='flex'>
          <Button
            onClick={handleSubmit}
            disabled={buttonDisabled}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold tracking-wide focus:outline-none transition-all duration-300 ease-in-out ${
              buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Submit
          </Button>
        </div>

        <div className='flex justify-center gap-4'>
          <Link href='/auth/signin'>
            <p className='text-center hover:underline mt-6 text-sm'>Sign in</p>
          </Link>
          <Link href='/'>
            <p className='text-center hover:underline mt-6 text-sm'>Home</p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
