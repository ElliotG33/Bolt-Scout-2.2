import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const timeFrame = searchParams.get('timeFrame') || 'all';
  const limit = searchParams.get('limit') || 50;

  if (!query) {
    return NextResponse.json({ error: 'query is missing' }, { status: 400 });
  }

  try {
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
        'Origin': 'https://scout-ai.org',
        'Referer': 'https://scout-ai.org',
      },
    });

    if (!response.ok) {
      console.error('Reddit API Error:', response.statusText, response);
      return NextResponse.json(
        { error: 'Failed to fetch reddit posts.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.data?.children || [];
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      'Error fetching reddit posts:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Failed to fetch reddit posts.' },
      { status: 500 }
    );
  }
}
