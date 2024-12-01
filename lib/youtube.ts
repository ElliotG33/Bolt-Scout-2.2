import { YouTubeVideo } from '@/types/search'

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

export async function searchYouTube(query: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  if (!apiKey) {
    console.error('YouTube API key not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: maxResults.toString(),
      key: apiKey,
      type: 'video',
      order: 'date',
      safeSearch: 'moderate'
    })

    const response = await fetch(`${YOUTUBE_API_URL}?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error(`YouTube API Error: ${errorData.error?.message || response.statusText}`)
      return []
    }

    const data = await response.json()
    
    if (!data.items) {
      console.warn('No YouTube results found')
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title || '',
      description: item.snippet.description || '',
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle || '',
      publishedAt: item.snippet.publishedAt
    }))
  } catch (error) {
    console.error('YouTube search error:', error)
    return []
  }
}