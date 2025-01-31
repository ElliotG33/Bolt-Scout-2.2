'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import YoutubeIframe from '@/components/YoutubeIframe';

import { toast } from '@/hooks/use-toast';
import { ArrowRight, Search, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// import HorizontalBanner from '@/components/googlead/HorizontalBanner';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className='relative py-20 md:py-32 overflow-hidden'>
        <div className='container relative z-10'>
          <div className='text-center max-w-3xl mx-auto space-y-8'>
            <h1 className='font-lexend text-4xl md:text-6xl font-bold tracking-tight'>
              The Power of Scalable{' '}
              <span className='bg-gradient-to-r from-[#47e6b5] to-blue-600 bg-clip-text text-transparent'>
                Micro Influence
              </span>
            </h1>
            <p className='text-xl text-muted-foreground'>
              Find the people that want your shit.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <YoutubeIframe videoId='ZLhZQTu5pWU' />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id='how-it-works' className='py-20 bg-muted/50'>
        <div className='container'>
          <div className='max-w-3xl mx-auto text-center space-y-8'>
            <h2 className='font-lexend text-3xl md:text-4xl font-bold'>
              How it Works
            </h2>
            <p className='text-xl text-muted-foreground'>
              Scout AI strategically locates relevant online discussions across
              various social media platforms, enabling businesses to organically
              integrate their offerings into these conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Why it Works Section */}
      <section id='why-it-works' className='py-20'>
        <div className='container'>
          <div className='max-w-3xl mx-auto text-center space-y-8'>
            <h2 className='font-lexend text-3xl md:text-4xl font-bold'>
              Why it Works
            </h2>
            <p className='text-xl text-muted-foreground'>
              In an age where consumers are increasingly skeptical of paid ads
              and sponsored content, the authenticity of organic discussion
              stands out. Think about how often we scroll past sponsored links
              on Google to click a five-year-old Reddit thread, or trust YouTube
              comments over the product review video itself. Be the solution
              people naturally discover in these moments.
            </p>
          </div>
        </div>
      </section>
      <section id='features' className='py-20 bg-muted/50'>
        <div className='container'>
          <h2 className='font-lexend text-3xl md:text-4xl font-bold text-center mb-16'>
            Key Features
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='p-6 space-y-4 relative'>
              <div className='absolute top-4 right-4 bg-[#47e6b5] px-2 py-1 rounded-md text-white text-sm font-bold'>
                Coming Soon
              </div>
              <Search className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                AI Prioritization
              </h3>
              <p className='text-muted-foreground'>
                Analyzes post content and sorts results based on relevance to
                your intentions.
              </p>
            </Card>
            <Card className='p-6 space-y-4 relative'>
              <div className='absolute top-4 right-4 bg-[#47e6b5] px-2 py-1 rounded-md text-white text-sm font-bold'>
                Coming Soon
              </div>
              <Zap className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                Integrated Outreach Assistant
              </h3>
              <p className='text-muted-foreground'>
                Analyze content and generate personalized messages that align
                with context, provide value, and subtely promote your offering.
              </p>
            </Card>
            <Card className='p-6 space-y-4'>
              <MessageSquare className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                Smart Monitoring
              </h3>
              <p className='text-muted-foreground'>
                Set up alerts based on keywords and receive notifications about
                relevant conversations.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='py-20'>
        <div className='container'>
          <div className='max-w-2xl mx-auto text-center space-y-8'>
            <h2 className='font-lexend text-3xl md:text-4xl font-bold'>
              Ready to Scale Your Influence?
            </h2>
            <p className='text-xl text-muted-foreground'>
              (There&apos;s a FREE VERSION)
            </p>
            <Button size='lg' className='mt-8' asChild>
              <Link href='/auth/signup'>
                Get Started Now <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>

            {/* <HorizontalBanner /> */}
          </div>
        </div>
      </section>
      <Suspense fallback={null}>
        <SubscriptionHandler />
      </Suspense>
    </>
  );
}

// Extract the logic that uses useSearchParams into a separate component
function SubscriptionHandler() {
  const searchParams = useSearchParams();
  const subscription = searchParams.get('subscription') || '';

  useEffect(() => {
    if (subscription === 'success') {
      toast({
        title: 'Subscription Successful.',
        variant: 'default',
      });
    }
  }, [subscription]);

  return null; // This component doesn't render anything
}
