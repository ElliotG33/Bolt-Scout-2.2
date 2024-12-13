import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { TabsContent } from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowUpFromLine,
  ExternalLink,
  Heart,
  MessageCircleReply,
  MessageSquare,
  Repeat2,
} from 'lucide-react';

interface TwitterSearchResultProps {
  data: any;
}

export default function TwitterSearchResult({
  data,
}: TwitterSearchResultProps) {
  console.log('===data', data.length, data);

  return (
    <TabsContent value='twitter' className='space-y-4'>
      {data.length > 0 ? (
        data.map((post: any, index: number) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className='flex items-center gap-4 text-sm'>
                  <a
                    href={post.userUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-primary flex items-center gap-2'
                  >
                    @{post.username}
                    <ExternalLink className='h-4 w-4' />
                  </a>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.publishedAt))} ago
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground line-clamp-3 mb-4'>
                  {post.text}
                </p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <Heart className='h-4 w-4' />
                      <span>{post.like_count}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MessageCircleReply className='h-4 w-4' />
                      <span>{post.reply_count} Reply</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Repeat2 className='h-4 w-4' />
                      <span>{post.retweet_count} Repost</span>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      window.open(
                        post.tweetUrl,
                        '_blank',
                        'noopener,noreferrer'
                      )
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
        ))
      ) : (
        <p className='text-muted-foreground text-center py-8'>
          No results found. Try adjusting your search terms.
        </p>
      )}
    </TabsContent>
  );
}
