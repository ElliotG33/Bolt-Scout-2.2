'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/types/alerts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KeywordList } from '@/components/search/keyword-list';
import { Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getSubscriptionData } from '@/lib/actions/subscription';

interface AlertFormProps {
  onSubmit: (alert: Alert) => void;
}

export function AlertForm({ onSubmit }: AlertFormProps) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('24');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [planLimit, setPlanLimit] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (alertCount === 0 || planLimit === 0) return;

    if (alertCount >= planLimit) {
      setLimitReached(true);
    }
  }, [alertCount]);

  useEffect(() => {
    const fetchUserSubscription = async () => {
      const subscription = await getSubscriptionData();
      // console.log(subscription);
      setPlanLimit(subscription?.planDetails?.search_limit);
      if (subscription?.alertCount) setAlertCount(subscription?.alertCount);
      if (
        subscription?.alertCount >=
        subscription?.planDetails?.custom_alert_limit
      ) {
        setLimitReached(true);
      }
    };
    fetchUserSubscription();
  }, []);

  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || keywords.length === 0) {
      toast({
        title: 'Please provide a valid email and at least one keyword.',
        variant: 'destructive',
      });
      return;
    }

    if (limitReached) return;

    onSubmit({
      email,
      keywords,
      frequency: parseInt(frequency),
      active: true,
      _id: '',
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setEmail('');
    setKeywords([]);
    setFrequency('24');
    setAlertCount((prevCount) => prevCount + 1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className='pt-6 space-y-6'>
          <div className='space-y-4'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email address'
              required
            />
          </div>

          <div className='space-y-4'>
            <Label htmlFor='keywords'>Keywords</Label>
            <div className='flex gap-2'>
              <Input
                id='keywords'
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder='Enter keywords to track'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button
                type='button'
                onClick={handleAddKeyword}
                variant='secondary'
              >
                Add
              </Button>
            </div>
            <KeywordList keywords={keywords} onRemove={handleRemoveKeyword} />
          </div>

          <div className='space-y-4'>
            <Label htmlFor='frequency'>Check Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder='Select frequency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='24'>Every 24 hours</SelectItem>
                <SelectItem value='12'>Every 12 hours</SelectItem>
                <SelectItem value='6'>Every 6 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-start gap-2 p-4 bg-muted/50 rounded-lg'>
            <Info className='h-5 w-5 text-muted-foreground mt-0.5' />
            <p className='text-sm text-muted-foreground'>
              Alerts will begin processing approximately 1 hour after creation.
              You&apos;ll receive email notifications when new matching content
              is found.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end mt-6 space-y-6'>
        {limitReached && (
          <div className='text-red-600 p-8'>
            Limit Reached! Upgrade your plan.
          </div>
        )}

        <Button
          type='submit'
          disabled={!email || keywords.length === 0 || limitReached}
        >
          Create Alert
        </Button>
      </div>
    </form>
  );
}
