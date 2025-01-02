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

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultsType>({
    reddit: [],
    youtube: [],
    quora: [],
    twitter: [],
  });

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const { timeFrame, resultCount } = params;
      const primaryQuery = params.keywords.join(' OR ');
      const secondaryQuery =
        params.secondaryKeywords.length > 0
          ? ` AND (${params.secondaryKeywords.join(' OR ')})`
          : '';
      const query = primaryQuery + secondaryQuery;
      let twitterQuery = `(${primaryQuery})`;
      if (params.secondaryKeywords.length > 0) {
        twitterQuery += ` ${params.secondaryKeywords.join(' OR ')}`;
      }

      const [redditResults, youtubeResults, twitterResults] =
        await Promise.allSettled([
          searchReddit({ query, timeFrame, limit: resultCount }),
          searchYouTube({ query, timeFrame, limit: resultCount }),
          searchTwitter({ query: twitterQuery, timeFrame, limit: resultCount }),
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
        toast.info('No results found. Try adjusting your search terms.');
      } else {
        const total = redditData.length + youtubeData.length;
        toast.success(`Found ${total} result${total === 1 ? '' : 's'}`);
      }
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
      {(results.reddit.length > 0 ||
        results.youtube.length > 0 ||
        results.twitter.length > 0) && (
        <div className='mt-8'>
          <SearchResults {...results} />
        </div>
      )}
    </div>
  );
}
