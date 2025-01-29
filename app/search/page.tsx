'use client';

import { useState } from 'react';

import { SearchForm } from '@/components/search/search-form';
import { SearchResults } from '@/components/search/search-results';
import { searchReddit } from '@/lib/reddit';
import { searchYouTube } from '@/lib/youtube';
import { searchTwitter } from '@/lib/twitter';
import { toast } from 'sonner';
import {
  SearchParams,
  SearchResults as SearchResultsType,
} from '@/types/search';
import { logUserSearch } from '@/lib/actions/search';
import HorizontalBanner from '@/components/googlead/HorizontalBanner';
import { useSession } from 'next-auth/react';

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultsType>({
    reddit: [],
    youtube: [],
    quora: [],
    twitter: [],
  });

  const { data: session } = useSession();
  const isPaidPlan = session?.subscription === true;

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const {
        timeFrame,
        resultCount,
        keywords,
        secondaryKeywords,
        antiKeywords,
      } = params;
      const primaryQuery = keywords.join(' OR ');
      const secondaryQuery =
        secondaryKeywords.length > 0
          ? ` AND (${secondaryKeywords.join(' OR ')})`
          : '';
      const query = primaryQuery + secondaryQuery;
      let twitterQuery = `(${primaryQuery})`;
      if (secondaryKeywords.length > 0) {
        twitterQuery += ` ${secondaryKeywords.join(' OR ')}`;
      }

      // Array to hold the promises
      const promises: Promise<any>[] = [];

      // Always include searchReddit
      promises.push(
        searchReddit({ query, timeFrame, limit: resultCount, antiKeywords })
      );

      // Add searchYouTube and searchTwitter if paid plan
      if (isPaidPlan) {
        promises.push(
          searchYouTube({ query, timeFrame, limit: resultCount, antiKeywords }),
          searchTwitter({
            query: twitterQuery,
            timeFrame,
            limit: resultCount,
            antiKeywords,
          })
        );
      }

      // Execute all promises
      const settledResults = await Promise.allSettled(promises);

      // Extract data from settled promises
      const redditData =
        settledResults[0].status === 'fulfilled' ? settledResults[0].value : [];

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
        toast.info('No results found. Try adjusting your search terms.');
      } else {
        const total = redditData.length + youtubeData.length;
        toast.success(`Found ${total} result${total === 1 ? '' : 's'}`);
      }

      await logUserSearch({
        keywords,
        secondaryKeywords,
        antiKeywords,
        timeFrame,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container py-8 max-w-4xl'>
      <div className='space-y-4 mb-8'>
        <h1 className='font-lexend text-3xl font-bold tracking-tight'>
          Search
        </h1>
        <p className='text-muted-foreground'>
          Search across multiple platforms using keywords to find relevant
          discussions and opportunities.
        </p>
      </div>
      <SearchForm onSubmit={handleSearch} isLoading={isLoading} />

      <HorizontalBanner />

      {(results.reddit.length > 0 ||
        results.youtube.length > 0 ||
        results.twitter.length > 0) && (
        <div className='mt-8'>
          <SearchResults {...results} isPaidPlan={isPaidPlan} />

          <HorizontalBanner />
        </div>
      )}
    </div>
  );
}
