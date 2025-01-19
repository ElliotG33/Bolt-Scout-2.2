'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import type { SearchResults as SearchResultsType } from '@/types/search';
import { SearchResults } from '@/components/search/search-results';
import { searchReddit } from '@/lib/reddit';
import { searchYouTube } from '@/lib/youtube';
import { searchTwitter } from '@/lib/twitter';
import { toast } from 'sonner';

export default function AlertResults() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchResultsType>({
    reddit: [],
    youtube: [],
    quora: [],
    twitter: [],
  });
  const isValidId = useRef(false);
  const keywords = useRef<string[]>([]);
  const antiKeywords = useRef<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/alerts/get?id=${id}`);
        const alert = result.data?.alert;
        if (!alert) {
          return;
        }

        isValidId.current = true;
        keywords.current = alert.keywords;
        // antiKeywords.current = alert.antiKeywords;

        const timeFrame = 'week';
        const limit = 50;
        const query = alert.keywords.join(' OR ');

        const [redditResults, youtubeResults, twitterResults] =
          await Promise.allSettled([
            searchReddit({
              query,
              timeFrame,
              limit,
              antiKeywords: antiKeywords.current,
            }),
            searchYouTube({
              query,
              timeFrame,
              limit,
              antiKeywords: antiKeywords.current,
            }),
            searchTwitter({
              query,
              timeFrame,
              limit,
              antiKeywords: antiKeywords.current,
            }),
          ]);

        const redditData =
          redditResults.status === 'fulfilled' ? redditResults.value : [];
        const youtubeData =
          youtubeResults.status === 'fulfilled' ? youtubeResults.value : [];
        const twitterData =
          twitterResults.status === 'fulfilled' ? twitterResults.value : [];

        setResults({
          ...results,
          reddit: redditData,
          youtube: youtubeData,
          twitter: twitterData,
        });

        if (
          redditData.length === 0 &&
          youtubeData.length === 0 &&
          twitterData.length === 0
        ) {
          toast.info('No results found.');
        } else {
          const total = redditData.length + youtubeData.length;
          toast.success(`Found ${total} result${total === 1 ? '' : 's'}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch result');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasResult =
    results.reddit.length > 0 ||
    results.youtube.length > 0 ||
    results.twitter.length > 0;

  return (
    <div className='container py-8 max-w-4xl'>
      {isLoading && <div className='py-12 mb-12 text-center'>Loading...</div>}

      {!isLoading && isValidId.current === false && (
        <div className='py-12 mb-12 text-center'>Invalid Request!</div>
      )}

      {hasResult && (
        <SearchResults
          {...results}
          title={
            <>
              <p>Alerts based on your keywords.</p>
              <p>
                {keywords.current.map((keyword) => (
                  <span
                    key={keyword}
                    className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-primary/30 bg-primary/10 text-primary mr-2'
                  >
                    {keyword}
                  </span>
                ))}
              </p>
            </>
          }
        />
      )}
    </div>
  );
}
