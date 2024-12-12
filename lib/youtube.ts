import { TimeFrame, YouTubeVideo } from '@/types/search';
import { calculateStartTime } from './utils/search';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface YoutubeSearchProps {
  query: string;
  limit: number;
  timeFrame: TimeFrame;
}

export async function searchYouTube({
  query,
  limit = 50,
  timeFrame,
}: YoutubeSearchProps): Promise<YouTubeVideo[]> {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error('YouTube API key not configured');
    return [];
  }

  try {
    const startTime = calculateStartTime(timeFrame);
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: limit.toString(),
      key: API_KEY,
      type: 'video',
      order: 'date',
      safeSearch: 'moderate',
      ...(startTime && { publishedAfter: startTime }),
    });

    const response = await fetch(`${YOUTUBE_API_URL}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `YouTube API Error: ${errorData.error?.message || response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    if (!data.items) {
      console.warn('No YouTube results found');
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title || '',
      description: item.snippet.description || '',
      thumbnail:
        item.snippet.thumbnails?.default?.url ||
        item.snippet.thumbnails?.medium?.url ||
        '',
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle || '',
      channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}
