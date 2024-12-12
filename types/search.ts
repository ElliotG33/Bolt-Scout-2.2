export type TimeFrame = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

export interface SearchParams {
  keywords: string[];
  secondaryKeywords: string[];
  antiKeywords: string[];
  timeFrame: TimeFrame;
  resultCount: number;
}

export interface RedditPost {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  date: string;
  score: number;
  numComments: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  channelUrl: string;
  publishedAt: string;
}

export interface QuoraPost {
  title: string;
  content: string;
  url: string;
  author: string;
  date: string;
}

export interface TwitterPost {
  id: string;
  text: string;
  url: string;
  createdAt: string;
  author: {
    name: string;
    username: string;
    profileImageUrl: string;
  };
  metrics: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

export interface SearchResults {
  reddit: RedditPost[];
  youtube: YouTubeVideo[];
  quora: QuoraPost[];
  twitter: TwitterPost[];
}
