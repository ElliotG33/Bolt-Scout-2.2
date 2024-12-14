import { TimeFrame, TwitterPost } from '@/types/search';
import { calculateStartTime } from './utils/search';
import data from './api/data/twitter.json';

interface SearchTwitterProps {
  query: string;
  limit: number;
  timeFrame: TimeFrame;
}

const TWITTER_API_URL = process.env.NEXT_PUBLIC_TWITTER_API_URL;

export async function searchTwitter({
  query,
  timeFrame,
  limit = 50,
}: SearchTwitterProps): Promise<TwitterPost[]> {
  if (!TWITTER_API_URL) {
    console.error('Twitter endpoint not configured');
    return [];
  }

  try {
    const startTime = calculateStartTime('week');//there is limit of a week
    const params = new URLSearchParams({
      query,
      ...(startTime && { start_time: startTime }),
      max_results: limit.toString(),
    });

    //Search tweets based on the query
    const response = await fetch(`${TWITTER_API_URL}?${params}`);

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

    return data.map((item: any) => ({
      id: item.id,
      text: item.text,
      publishedAt: item.created_at,
      username: item.username,
      userUrl: item.userUrl,
      tweetUrl: item.tweetUrl,
      ...item.public_metrics,
    }));
  } catch (error) {
    console.error('Twitter search error:', error);
    return [];
  }
}