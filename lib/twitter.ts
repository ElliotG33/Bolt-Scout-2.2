import { TimeFrame, TwitterPost } from '@/types/search';

interface SearchTwitterProps {
  query: string;
  limit: number;
  timeFrame: TimeFrame;
}

export async function searchTwitter({
  query,
  timeFrame,
  limit = 20,
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
