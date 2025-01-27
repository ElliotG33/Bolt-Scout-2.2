import { RedditPost, TimeFrame } from '@/types/search';
// import data from './api/data/reddit.json';

interface RedditSearchProps {
  query: string;
  timeFrame: TimeFrame;
  limit: number;
  antiKeywords: string[];
}

export async function searchReddit({
  query,
  timeFrame,
  limit = 50,
  antiKeywords,
}: RedditSearchProps): Promise<RedditPost[]> {
  try {
    // Convert timeFrame to Reddit's format
    const t =
      timeFrame === 'all'
        ? 'all'
        : timeFrame === 'hour'
        ? 'hour'
        : timeFrame === 'day'
        ? 'day'
        : timeFrame === 'week'
        ? 'week'
        : timeFrame === 'month'
        ? 'month'
        : 'year';

    const params = new URLSearchParams({
      query,
      sort: 'new',
      t,
      limit: String(limit),
    });
    const response = await fetch(`/api/reddit?${params}`);

    if (!response.ok) {
      console.error('Reddit API Error:', response.statusText);
      return [];
    }

    const data = await response.json();
    if (data.length === 0) {
      console.warn('No reddit posts found');
      return [];
    }

    return data
      .map((post: any) => ({
        title: post.data.title || '',
        content: post.data.selftext || '',
        url: `https://reddit.com${post.data.permalink}`,
        subreddit: post.data.subreddit_name_prefixed || '',
        date: new Date(post.data.created_utc * 1000).toISOString(),
        score: post.data.score || 0,
        numComments: post.data.num_comments || 0,
      }))
      .filter((post: any) => {
        if (!antiKeywords?.length) return true; // Skip filtering if no antiKeywords

        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        return !antiKeywords.some((keyword) => {
          const iKeyword = keyword.toLowerCase();
          return title.includes(iKeyword) || content.includes(iKeyword);
        });
      });
  } catch (error) {
    console.error('Reddit search error:', error);
    return [];
  }
}
