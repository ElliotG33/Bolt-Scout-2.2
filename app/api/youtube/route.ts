import { calculateStartTime } from '@/lib/utils/search';
import { TimeFrame } from '@/types/search';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: Request) {
  if (!API_KEY) {
    console.error('YouTube API key not configured');
    return NextResponse.json(
      { error: 'YouTube API key not configured.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const timeFrame = (searchParams.get('timeFrame') || 'all') as TimeFrame;
  const maxResults = searchParams.get('limit') || '50';

  if (!query) {
    return NextResponse.json({ error: 'query is missing' }, { status: 400 });
  }

  try {
    const startTime = calculateStartTime(timeFrame);
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults,
      key: API_KEY,
      type: 'video',
      order: 'date',
      safeSearch: 'moderate',
      ...(startTime && { publishedAfter: startTime }),
    });

    const response = await fetch(`${YOUTUBE_API_URL}?${params}`);
    if (!response.ok) {
      console.error('YouTube API Error:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch youtube posts.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.items || [];
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      'Error fetching youtube posts:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Failed to fetch youtube posts.' },
      { status: 500 }
    );
  }
}
