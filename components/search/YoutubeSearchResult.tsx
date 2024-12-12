import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { TabsContent } from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ExternalLink } from 'lucide-react';

interface YoutubeSearchResultProps {
  data: any;
}

export default function YoutubeSearchResult({
  data,
}: YoutubeSearchResultProps) {
  return (
    <TabsContent value='youtube' className='space-y-4'>
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
                  <a
                    href={post.channelUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-primary flex items-center gap-2'
                  >
                    {post.channelTitle}
                    <ExternalLink className='h-4 w-4' />
                  </a>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.publishedAt))} ago
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-4'>
                  <Image
                    src={post.thumbnail}
                    alt='Youtube Thumbnail'
                    width={120}
                    height={90}
                  />
                  <p className='text-muted-foreground line-clamp-3 mb-4'>
                    {post.description}
                  </p>
                </div>
                <div className='flex items-center justify-end'>
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
        ))
      ) : (
        <p className='text-muted-foreground text-center py-8'>
          Nothing foundNo results found.
        </p>
      )}
    </TabsContent>
  );
}
