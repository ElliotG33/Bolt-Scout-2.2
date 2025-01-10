'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { toast } from '@/hooks/use-toast';
import { ArrowRight, Search, Zap, MessageSquare, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const searchParams = useSearchParams();
  // Access the parameter value
  const subscription = searchParams.get('subscription') || '';
  if (subscription === 'success') {
    toast({
      title: 'Subscription Successful.',
      variant: 'default',
    });
  }

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
              Discover and engage in relevant online discussions across social
              media platforms with AI-powered precision.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Button size='lg' asChild>
                <Link href='/get-started'>
                  Get Started <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='#how-it-works'>Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-muted/50'>
        <div className='container'>
          <h2 className='font-lexend text-3xl md:text-4xl font-bold text-center mb-16'>
            Key Features
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='p-6 space-y-4'>
              <Search className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                Hundreds of Platforms
              </h3>
              <p className='text-muted-foreground'>
                Access user-curated collection of platforms and online
                communities, recommended for promoting your product or service.
              </p>
            </Card>
            <Card className='p-6 space-y-4'>
              <Zap className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                Integrated AI Outreach
              </h3>
              <p className='text-muted-foreground'>
                Analyze content and craft personalized messages that resonate
                with conversation context and tone.
              </p>
            </Card>
            <Card className='p-6 space-y-4'>
              <MessageSquare className='h-12 w-12 text-[#47e6b5]' />
              <h3 className='font-lexend text-xl font-bold'>
                Smart Monitoring
              </h3>
              <p className='text-muted-foreground'>
                Set up alerts based on keywords and receive immediate
                notifications about relevant conversations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id='how-it-works' className='py-20'>
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
            <div className='grid md:grid-cols-2 gap-8 mt-12'>
              <div className='space-y-4'>
                <BarChart className='h-12 w-12 text-[#47e6b5] mx-auto' />
                <h3 className='font-lexend text-xl font-bold'>
                  Input & Analysis
                </h3>
                <p className='text-muted-foreground'>
                  Simply input keywords related to your business offering and
                  your intention. Scout AI crawls platforms and sorts posts
                  based on relevance.
                </p>
              </div>
              <div className='space-y-4'>
                <MessageSquare className='h-12 w-12 text-[#47e6b5] mx-auto' />
                <h3 className='font-lexend text-xl font-bold'>Engagement</h3>
                <p className='text-muted-foreground'>
                  Our AI helps craft personalized responses that naturally fit
                  into conversations, maintaining authenticity while scaling
                  your reach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-muted/50'>
        <div className='container'>
          <div className='max-w-2xl mx-auto text-center space-y-8'>
            <h2 className='font-lexend text-3xl md:text-4xl font-bold'>
              Ready to Scale Your Influence?
            </h2>
            <p className='text-xl text-muted-foreground'>
              Join thousands of businesses using Scout AI to discover and engage
              in meaningful conversations.
            </p>
            <Button size='lg' className='mt-8' asChild>
              <Link href='/get-started'>
                Get Started Now <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
