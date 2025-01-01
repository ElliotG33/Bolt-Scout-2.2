'use client';

import {
  RedditPost,
  YouTubeVideo,
  QuoraPost,
  TwitterPost,
} from '@/types/search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpFromLine,
  MessageSquare,
  ExternalLink,
  Youtube,
  Share2,
  ThumbsUp,
  Twitter,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import YoutubeSearchResult from './YoutubeSearchResult';
import TwitterSearchResult from './TwitterSearchResult';

interface SearchResultsProps {
  title?: React.ReactNode;
  reddit: RedditPost[];
  youtube: YouTubeVideo[];
  quora: QuoraPost[];
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
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='reddit' className='space-x-2'>
            <MessageSquare className='h-4 w-4' />
            <span>Reddit ({reddit.length})</span>
          </TabsTrigger>
          <TabsTrigger value='youtube' className='space-x-2'>
            <Youtube className='h-4 w-4' />
            <span>YouTube ({youtube.length})</span>
          </TabsTrigger>
          <TabsTrigger value='quora' className='space-x-2'>
            <Share2 className='h-4 w-4' />
            <span>Quora ({quora.length})</span>
          </TabsTrigger>
          <TabsTrigger value='twitter' className='space-x-2'>
            <Twitter className='h-4 w-4' />
            <span>X ({twitter.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='reddit' className='space-y-4'>
          {reddit.map((post, index) => (
            <motion.div
              key={post.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg font-medium'>
                    <a
                      href={post.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:text-primary flex items-center gap-2'
                    >
                      {post.title}
                      <ExternalLink className='h-4 w-4' />
                    </a>
                  </CardTitle>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span>{post.subreddit}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.date))} ago</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground line-clamp-3 mb-4'>
                    {post.content}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 text-sm'>
                      <div className='flex items-center gap-1'>
                        <ArrowUpFromLine className='h-4 w-4' />
                        <span>{post.score}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <MessageSquare className='h-4 w-4' />
                        <span>{post.numComments} comments</span>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        window.open(post.url, '_blank', 'noopener,noreferrer')
                      }
                      className='gap-2'
                    >
                      View Post
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <YoutubeSearchResult data={youtube} />

        <TabsContent value='quora' className='space-y-4'>
          <p className='text-muted-foreground text-center py-8'>
            Quora search coming soon...
          </p>
        </TabsContent>

        <TwitterSearchResult data={twitter} />
      </Tabs>
    </motion.div>
  );
}
