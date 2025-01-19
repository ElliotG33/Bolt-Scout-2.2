'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { isAuthPage } from '@/lib/utils/auth';

export function Footer() {
  const pathname = usePathname();
  if (isAuthPage(pathname)) return <></>;

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
          <div>
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium'>Subscribe to our newsletter</h4>
            <div className='flex space-x-2'>
              <Input placeholder='Enter your email' type='email' />
              <Button>Subscribe</Button>
            </div>
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

