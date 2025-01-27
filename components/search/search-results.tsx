'use client';

import {
  RedditPost,
  YouTubeVideo,
  QuoraPost,
  TwitterPost,
} from '@/types/search';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import YoutubeSearchResult from './YoutubeSearchResult';
import TwitterSearchResult from './TwitterSearchResult';
import RedditSearchResult from './RedditSearchResult';

interface SearchResultsProps {
  title?: React.ReactNode;
  reddit: RedditPost[];
  youtube: YouTubeVideo[];
  quora?: QuoraPost[];
  twitter: TwitterPost[];
}

export function SearchResults({
  reddit,
  youtube,
  quora,
  twitter,
  title,
}: SearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='space-y-4'
    >
      <h2 className='font-lexend text-2xl font-semibold mb-4'>
        {title || 'Search Results'}
      </h2>

      <Tabs defaultValue='reddit' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='reddit' className='space-x-2'>
            <MessageSquare className='h-4 w-4' />
            <span>Reddit ({reddit.length})</span>
          </TabsTrigger>
          <TabsTrigger value='youtube' className='space-x-2'>
            <Youtube className='h-4 w-4' />
            <span>YouTube ({youtube.length})</span>
          </TabsTrigger>
          {/* <TabsTrigger value='quora' className='space-x-2'>
            <Share2 className='h-4 w-4' />
            <span>Quora ({quora.length})</span>
          </TabsTrigger> */}
          <TabsTrigger value='twitter' className='space-x-2'>
            <Twitter className='h-4 w-4' />
            <span>X ({twitter.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='reddit' className='space-y-4'>
          <RedditSearchResult data={reddit} />
        </TabsContent>

        <YoutubeSearchResult data={youtube} />

        {/* <TabsContent value='quora' className='space-y-4'>
          <p className='text-muted-foreground text-center py-8'>
            Quora search coming soon...
          </p>
        </TabsContent> */}

        <TwitterSearchResult data={twitter} />
      </Tabs>
    </motion.div>
  );
}
