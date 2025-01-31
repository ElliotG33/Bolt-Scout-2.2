import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { TabsContent } from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpFromLine, ExternalLink, MessageSquare } from 'lucide-react';
// import HorizontalBanner from '../googlead/HorizontalBanner';

interface RedditSearchResultProps {
  data: any;
}

export default function RedditSearchResult({ data }: RedditSearchResultProps) {
  return (
    <TabsContent value='reddit' className='space-y-4'>
      {data.length > 0 ? (
        data.map((post: any, index: number) => (
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

            {/* {index > 0 && index % 9 === 0 && <HorizontalBanner />} */}
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
