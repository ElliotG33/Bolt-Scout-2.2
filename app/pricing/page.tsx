'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { tiers } from '@/lib/tiers';
import { navigateToPortal } from '@/helpers/stripe';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const onSubscribe = async (planId: string) => {
    console.log('==session', session,planId);
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (planId === 'tier-enterprise') {
      alert('Please call us for Enterprise Plan. Thank you.');
      return;
    }

    if (session.subscription) {
      return navigateToPortal(session);
    }

    handleSubscribe(planId);
  };

  const handleSubscribe = async (planId: string) => {
    /*try {
      console.log('create subscription', 'starter', new Date());
      await createSubscription({ planId: 'starter', startDate: new Date() });
    } catch (error: any) {
      console.log(error);
    }
    return;
    */

    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    // Make a request to API route to create the checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });

    const { sessionId } = await response.json();
    // Redirect to Stripe Checkout with the session ID
    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error(result.error.message);
      alert('There was an error redirecting to checkout. Please try again.');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='font-lexend text-4xl font-bold tracking-tight sm:text-5xl'>
              Simple, transparent pricing
            </h1>
            <p className='mt-6 text-lg leading-8 text-muted-foreground'>
              Choose the perfect plan for your needs. All plans include our core
              features with different usage limits.
            </p>
          </div>
          <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
            <AnimatePresence>
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`relative flex flex-col justify-between p-8 ${
                      tier.mostPopular ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                  >
                    {tier.mostPopular && (
                      <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                        <span className='inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'>
                          Most popular
                        </span>
                      </div>
                    )}
                    <div>
                      <div className='flex items-center justify-between gap-x-4'>
                        <h2 className='text-lg font-semibold leading-8'>
                          {tier.name}
                        </h2>
                      </div>
                      <p className='mt-4 text-sm leading-6 text-muted-foreground'>
                        {tier.description}
                      </p>
                      <p className='mt-6 flex items-baseline gap-x-1'>
                        <span className='text-4xl font-bold tracking-tight'>
                          {tier.price}
                        </span>
                        <span className='text-sm font-semibold leading-6 text-muted-foreground'>
                          /month
                        </span>
                      </p>
                      <ul
                        role='list'
                        className='mt-8 space-y-3 text-sm leading-6'
                      >
                        {tier.features.map((feature) => (
                          <li key={feature} className='flex gap-x-3'>
                            <Check className='h-5 w-5 flex-none text-primary' />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => onSubscribe(tier.id)}
                      className='mt-8'
                      variant={tier.mostPopular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
