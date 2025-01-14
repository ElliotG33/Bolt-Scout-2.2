'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { isAuthPage } from '@/lib/utils/auth';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { navigateToPortal } from '@/helpers/stripe';

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'How it Works', href: '/#how-it-works' },
  { name: 'Search', href: '/search' },
  { name: 'Alerts', href: '/alerts' },
  { name: 'Pricing', href: '/pricing' },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (isAuthPage(pathname)) return <></>;

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/';
    }
    return pathname === href;
  };

  const logout = async () => {
    try {
      await axios.get('/api/users/signout');
      toast({
        title: 'Signout Successful',
        variant: 'default',
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: error.message,
        variant: 'destructive',
      });
    }
  };

  const manageAccount = async (e: any) => {
    e.preventDefault();
    return navigateToPortal(session);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='font-lexend text-xl font-bold'>Scout AI</span>
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm ${
                isActive(item.href)
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='flex items-center space-x-4'>
          <div className='hidden md:flex items-center space-x-4'>
            <ModeToggle />

            {session?.subscription ? (
              <Button variant='ghost' onClick={manageAccount}>
                Manage Account
              </Button>
            ) : (
              <Button variant='ghost' onClick={() => alert('You are currently using Free Plan. To subscribe to available plans click on Pricing.')}>Free Plan</Button>
            )}

            <Button variant='ghost' asChild>
              {session ? (
                <Link href='#' onClick={() => signOut()}>
                  Sign Out
                </Link>
              ) : (
                <Link href='/auth/signin'>Sign In</Link>
              )}
            </Button>
            <Button asChild>
              <Link href='/get-started'>Get Started</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className='flex flex-col space-y-4 mt-8'>
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm ${
                      isActive(item.href)
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button variant='ghost' asChild className='justify-start px-2'>
                  <Link href='/signin'>Sign In</Link>
                </Button>
                <Button asChild className='justify-start'>
                  <Link href='/get-started'>Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
