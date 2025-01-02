'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { KeywordList } from '@/components/search/keyword-list';
import { TimeFrame, SearchParams } from '@/types/search';

interface SearchFormProps {
  onSubmit: (data: SearchParams) => void;
  isLoading: boolean;
}

const timeFrameOptions: { value: TimeFrame; label: string }[] = [
  { value: 'hour', label: 'Past Hour' },
  { value: 'day', label: 'Past 24 Hours' },
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: 'year', label: 'Past Year' },
  { value: 'all', label: 'All Time' },
];

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [antiKeywords, setAntiKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentSecondaryKeyword, setCurrentSecondaryKeyword] = useState('');
  const [currentAntiKeyword, setCurrentAntiKeyword] = useState('');
  const [resultCount, setResultCount] = useState([50]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');

  const handleAddKeyword = (type: 'primary' | 'secondary' | 'anti') => {
    if (type === 'primary' && currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    } else if (type === 'secondary' && currentSecondaryKeyword.trim()) {
      setSecondaryKeywords([
        ...secondaryKeywords,
        currentSecondaryKeyword.trim(),
      ]);
      setCurrentSecondaryKeyword('');
    } else if (type === 'anti' && currentAntiKeyword.trim()) {
      setAntiKeywords([...antiKeywords, currentAntiKeyword.trim()]);
      setCurrentAntiKeyword('');
    }
  };

  const handleRemoveKeyword = (
    type: 'primary' | 'secondary' | 'anti',
    index: number
  ) => {
    if (type === 'primary') {
      setKeywords(keywords.filter((_, i) => i !== index));
    } else if (type === 'secondary') {
      setSecondaryKeywords(secondaryKeywords.filter((_, i) => i !== index));
    } else {
      setAntiKeywords(antiKeywords.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      keywords,
      secondaryKeywords,
      antiKeywords,
      timeFrame,
      resultCount: resultCount[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <Card>
        <CardContent className='pt-6 space-y-8'>
          {/* Primary Keywords */}
          <div className='space-y-4'>
            <Label htmlFor='keywords'>Primary Keywords</Label>
            <div className='flex gap-2'>
              <Input
                id='keywords'
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                placeholder='Enter primary keywords to track'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword('primary');
                  }
                }}
              />
              <Button
                type='button'
                onClick={() => handleAddKeyword('primary')}
                variant='secondary'
              >
                Add
              </Button>
            </div>
            <KeywordList
              keywords={keywords}
              onRemove={(index) => handleRemoveKeyword('primary', index)}
            />
          </div>

          {/* Secondary Keywords */}
          <div className='space-y-4'>
            <Label htmlFor='secondary-keywords'>Secondary Keywords</Label>
            <p className='text-sm text-muted-foreground'>
              Posts must contain at least one primary keyword AND one secondary
              keyword
            </p>
            <div className='flex gap-2'>
              <Input
                id='secondary-keywords'
                value={currentSecondaryKeyword}
                onChange={(e) => setCurrentSecondaryKeyword(e.target.value)}
                placeholder='Enter secondary keywords to track'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword('secondary');
                  }
                }}
              />
              <Button
                type='button'
                onClick={() => handleAddKeyword('secondary')}
                variant='secondary'
              >
                Add
              </Button>
            </div>
            <KeywordList
              keywords={secondaryKeywords}
              onRemove={(index) => handleRemoveKeyword('secondary', index)}
              variant='secondary'
            />
          </div>

          {/* Anti-Keywords */}
          <div className='space-y-4'>
            <Label htmlFor='anti-keywords'>Anti-Keywords</Label>
            <div className='flex gap-2'>
              <Input
                id='anti-keywords'
                value={currentAntiKeyword}
                onChange={(e) => setCurrentAntiKeyword(e.target.value)}
                placeholder='Enter keywords to exclude'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword('anti');
                  }
                }}
              />
              <Button
                type='button'
                onClick={() => handleAddKeyword('anti')}
                variant='secondary'
              >
                Add
              </Button>
            </div>
            <KeywordList
              keywords={antiKeywords}
              onRemove={(index) => handleRemoveKeyword('anti', index)}
              variant='destructive'
            />
          </div>

          {/* Time Frame */}
          <div className='space-y-4'>
            <Label htmlFor='timeframe'>Time Frame</Label>
            <div className='flex flex-wrap gap-2'>
              {timeFrameOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  type='button'
                  variant={timeFrame === value ? 'default' : 'outline'}
                  onClick={() => setTimeFrame(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Result Count */}
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <Label>Number of Results</Label>
              <span className='text-sm text-muted-foreground'>
                {resultCount[0]} results
              </span>
            </div>
            <Slider
              value={resultCount}
              onValueChange={setResultCount}
              max={100}
              min={1}
              step={1}
              className='w-full'
            />
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          type='submit'
          size='lg'
          disabled={
            isLoading || keywords.length === 0 || secondaryKeywords.length === 0
          }
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Searching...
            </>
          ) : (
            <>
              <Search className='mr-2 h-4 w-4' />
              Search
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
