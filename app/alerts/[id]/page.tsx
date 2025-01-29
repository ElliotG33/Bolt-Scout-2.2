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
  const isPaidPlan = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/alerts/${id}`);
        const alert = result.data?.alert;
        if (!alert) {
          return;
        }

        isPaidPlan.current = result.data.isPaidPlan;

        isValidId.current = true;
        keywords.current = alert.keywords;

        const timeFrame = 'week';
        const limit = 50;
        const query = alert.keywords.join(' OR ');

        // Array to hold the promises
        const promises: Promise<any>[] = [];

        // Always include searchReddit
        promises.push(
          searchReddit({
            query,
            timeFrame,
            limit,
            antiKeywords: antiKeywords.current,
          })
        );

        // Add searchYouTube and searchTwitter if paid plan
        if (isPaidPlan) {
          promises.push(
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
            })
          );
        }

        // Execute all promises
        const settledResults = await Promise.allSettled(promises);

        // Extract data from settled promises
        const redditData =
          settledResults[0].status === 'fulfilled'
            ? settledResults[0].value
            : [];

        const youtubeData = isPaidPlan
          ? settledResults[1].status === 'fulfilled'
            ? settledResults[1].value
            : []
          : [];

        const twitterData = isPaidPlan
          ? settledResults[2].status === 'fulfilled'
            ? settledResults[2].value
            : []
          : [];

        // Update state
        setResults({
          reddit: redditData,
          youtube: youtubeData,
          twitter: twitterData,
          quora: [],
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
          isPaidPlan={isPaidPlan.current}
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
