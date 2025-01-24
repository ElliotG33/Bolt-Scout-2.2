'use client';

import { useState } from 'react';
import Link from 'next/link';

import axios from 'axios';
import { Github, Twitter, Linkedin } from 'lucide-react';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { isAuthPage } from '@/lib/utils/auth';

export function Footer() {
  const [email, setEmail] = useState('');
  const pathname = usePathname();
  if (isAuthPage(pathname)) return <></>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/subscribe', { email });
      if (response.status === 200) {
        toast({
          title: "You're subscribed! Thanks for joining.",
          variant: 'default',
        });
        setEmail('');
      } else {
        toast({
          title: 'Subscription failed. Please try again.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'An error occurred. Please try again.',
        variant: 'default',
      });
    }
  };

  return (
    <footer className='border-t bg-background'>
      <div className='container py-12 md:py-16 lg:py-20'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <h3 className='font-lexend text-lg font-bold'>Scout AI</h3>
            <p className='text-sm text-muted-foreground'>
              Under no circumstances should you ever read this sentence.
            </p>
          </div>
          <div>
            <h4 className='font-medium mb-4'>Menu</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='#features'
                  className='text-muted-foreground hover:text-primary'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#how-it-works'
                  className='text-muted-foreground hover:text-primary'
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href='#pricing'
                  className='text-muted-foreground hover:text-primary'
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div></div>
          <div className='space-y-4'>
            <form onSubmit={handleSubmit}>
              <h4 className='font-medium'>Subscribe to our newsletter</h4>
              <div className='flex space-x-2'>
                <Input
                  placeholder='Enter your email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button>Subscribe</Button>
              </div>
            </form>
            <div className='flex space-x-4'>
              <Link
                href='https://www.linkedin.com/company/scout-ai-marketing-services/'
                className='text-muted-foreground hover:text-primary'
              >
                <Linkedin className='h-5 w-5' />
              </Link>
            </div>
          </div>
        </div>
        <div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} Scout AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
