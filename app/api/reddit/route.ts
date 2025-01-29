import { NextResponse } from 'next/server';

const REDDIT_API = process.env.REDDIT_API;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const timeFrame = searchParams.get('timeFrame') || 'all';
  const limit = searchParams.get('limit') || '50';

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

    const params = new URLSearchParams({
      q: query,
      t,
      limit: limit,
      sort: 'new',
    });
    const response = await fetch(`${REDDIT_API}?${params}`);
    if (!response.ok) {
      console.error('Reddit API Error:', response.statusText, response);
      return NextResponse.json(
        { error: 'Failed to fetch reddit posts.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
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
