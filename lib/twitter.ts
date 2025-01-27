import { TimeFrame, TwitterPost } from '@/types/search';
// import data from './api/data/twitter.json';

interface SearchTwitterProps {
  query: string;
  limit: number;
  timeFrame: TimeFrame;
  antiKeywords: string[];
}

export async function searchTwitter({
  query,
  timeFrame,
  limit,
  antiKeywords,
}: SearchTwitterProps): Promise<TwitterPost[]> {
  try {
    const params = new URLSearchParams({
      query,
      ...(timeFrame && { start_time: timeFrame }),
      max_results: limit.toString(),
    });

    //Search tweets based on the query
    const response = await fetch(`/api/twitter?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Twitter API Error: ${errorData.error?.message || response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    if (data.length === 0) {
      console.warn('No Tweets found');
      return [];
    }

    return data
      .map((post: any) => ({
        id: post.id,
        text: post.text,
        publishedAt: post.created_at,
        username: post.username,
        userUrl: post.userUrl,
        tweetUrl: post.tweetUrl,
        ...post.public_metrics,
      }))
      .filter((post: any) => {
        if (!antiKeywords?.length) return true; // Skip filtering if no antiKeywords

        const content = post.text.toLowerCase();
        return !antiKeywords.some((keyword) => {
          const iKeyword = keyword.toLowerCase();
          return content.includes(iKeyword);
        });
      });
  } catch (error) {
    console.error('Twitter search error:', error);
    return [];
  }
}
