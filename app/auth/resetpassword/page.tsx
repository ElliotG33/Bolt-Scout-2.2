'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function ResetPasswordPage() {
  const { data: session } = useSession();
  if (session) {
    redirect('/');
  }
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = window.location.search.split('=')[1];
    setToken(params || '');
    if (!params) {
      toast({
        title: 'Invalid reset request',
        variant: 'destructive',
      });
    }
  }, []);

  useEffect(() => {
    if (password.length > 0 && confirmPassword.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [password, confirmPassword]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/resetpassword', {
        token,
        password,
      });
      toast({
        title: 'Password reset successfully',
        variant: 'default',
      });
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='flex flex-col items-center justify-center min-h-screen py-12'>
      <CardContent className='pt-12 pb-12 space-y-12 rounded-lg shadow-lg w-full max-w-md border bg-card text-card-foreground'>
        <h1 className='text-3xl font-bold mb-6'>Reset Password</h1>
        <div className='space-y-4'>
          <Label htmlFor='password'>New Password</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter new password'
            required
          />
        </div>

        <div className='space-y-4'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Enter confirm password'
            required
          />
        </div>

        <div className='flex'>
          <Button
            onClick={handleResetPassword}
            disabled={loading || buttonDisabled}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold tracking-wide focus:outline-none transition-all duration-300 ease-in-out ${
              buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
