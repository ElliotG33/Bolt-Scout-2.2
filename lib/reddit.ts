import { RedditPost, TimeFrame } from '@/types/search';

interface RedditSearchProps {
  query: string;
  timeFrame: TimeFrame;
  limit: number;
}

export async function searchReddit({
  query,
  timeFrame,
  limit = 50,
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

    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
      query
    )}&sort=new&t=${t}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Scout-AI/1.0',
      },
    });

    if (!response.ok) {
      console.error('Reddit API Error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.data?.children) {
      return [];
    }

    return data.data.children.map((post: any) => ({
      title: post.data.title || '',
      content: post.data.selftext || '',
      url: `https://reddit.com${post.data.permalink}`,
      subreddit: post.data.subreddit_name_prefixed || '',
      date: new Date(post.data.created_utc * 1000).toISOString(),
      score: post.data.score || 0,
      numComments: post.data.num_comments || 0,
    }));
  } catch (error) {
    console.error('Reddit search error:', error);
    return [];
  }
}
