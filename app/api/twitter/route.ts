import { NextResponse } from 'next/server';
import axios from 'axios';
import { calculateStartTime } from '@/lib/utils/search';

const TWITTER_API_URL = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  // const start_time = searchParams.get('start_time');
  const start_time = calculateStartTime('week'); //there is limit of a week
  const max_results = searchParams.get('max_results') || 20;

  if (!query) {
    return NextResponse.json({ error: 'query is missing' }, { status: 400 });
  }

  try {
    // Prepare query parameters
    const queryParams = new URLSearchParams({
      query: String(query),
      max_results: String(max_results),
      sort_order: 'recency',
      expansions: 'author_id',
      'user.fields': 'username,name,profile_image_url',
      'tweet.fields': 'public_metrics,created_at',
    });
    if (start_time) {
      queryParams.append('start_time', String(start_time));
    }

    // Fetch recent tweets
    const { data: tweetData } = await axios.get(
      `${TWITTER_API_URL}/tweets/search/recent?${queryParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      }
    );

    // Fetch author details for each tweet
    const tweetsWithUsernames = await Promise.all(
      tweetData.data.map(async (tweet: any) => {
        try {
          const { data: userData } = await axios.get(
            `${TWITTER_API_URL}/users/${tweet.author_id}`,
            {
              headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
            }
          );
          const username = userData.data.username;
          const tweetUrl = `https://twitter.com/${username}/status/${tweet.id}`;
          const userUrl = `https://twitter.com/${username}`;

          return {
            ...tweet,
            username,
            tweetUrl,
            userUrl,
          };
        } catch (error: any) {
          console.error(
            `Error fetching user data for tweet ${tweet.id}:`,
            error.message
          );
          return tweet; // Return tweet as is if user data fetching fails
        }
      })
    );
    return NextResponse.json(tweetsWithUsernames);
  } catch (error: any) {
    console.error(
      'Error fetching tweets:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
