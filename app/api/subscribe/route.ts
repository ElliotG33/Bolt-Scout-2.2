import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const reqBody = await request.json();
  const { email } = reqBody;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const config = {
    headers: {
      Authorization: `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(url, data, config);
    return NextResponse.json(
      { message: 'Subscription successful', response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    if (error.response?.data?.title === 'Member Exists') {
      return NextResponse.json(
        { message: 'Subscription successful' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Subscription failed' },
        { status: 500 }
      );
    }
  }
}
