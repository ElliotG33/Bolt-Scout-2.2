import { TimeFrame, YouTubeVideo } from '@/types/search';
// import data from './api/data/youtube.json';

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
  try {
    const params = new URLSearchParams({
      query,
      timeFrame,
      limit: String(limit),
    });
    const response = await fetch(`/api/youtube?${params}`);

    if (!response.ok) {
      console.error('Reddit API Error:', response.statusText);
      return [];
    }

    const data = await response.json();
    if (data.length === 0) {
      console.warn('No youtube posts found');
      return [];
    }

    return data
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
        if (!antiKeywords?.length) return true; // Skip filtering if no antiKeywords

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
