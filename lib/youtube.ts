import { TimeFrame, YouTubeVideo } from '@/types/search';
import { calculateStartTime } from './utils/search';
// import data from './api/data/youtube.json';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface YoutubeSearchProps {
  query: string;
  limit: number;
  timeFrame: TimeFrame;
  antiKeywords: string[];
}

export async function searchYouTube({
  query,
  limit = 50,
  timeFrame,
  antiKeywords,
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

    return data.items
      .map((post: any) => ({
        id: post.id.videoId,
        title: post.snippet.title || '',
        description: post.snippet.description || '',
        thumbnail:
          post.snippet.thumbnails?.default?.url ||
          post.snippet.thumbnails?.medium?.url ||
          '',
        url: `https://youtube.com/watch?v=${post.id.videoId}`,
        channelTitle: post.snippet.channelTitle || '',
        channelUrl: `https://www.youtube.com/channel/${post.snippet.channelId}`,
        publishedAt: post.snippet.publishedAt,
      }))
      .filter((post: any) => {
        const title = post.title.toLowerCase();
        const content = post.description.toLowerCase();
        return !antiKeywords.some((keyword) => {
          const iKeyword = keyword.toLowerCase();
          return title.includes(iKeyword) || content.includes(iKeyword);
        });
      });
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}
