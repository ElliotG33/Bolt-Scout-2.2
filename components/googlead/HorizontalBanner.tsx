import { useEffect, useRef } from 'react';
import { loadScript } from '@/lib/utils/loadScript';

interface HorizontalBannerProps {
  slot?: string;
}

const GOOGLE_AD_CLIENT_ID = 'ca-pub-9770704114610149';

export default function HorizontalBanner({
  slot = '5657566101',
}: HorizontalBannerProps) {
  const isAdInitialized = useRef(false);

  useEffect(() => {
    // Load the Google AdSense script dynamically
    loadScript(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_AD_CLIENT_ID}`,
      () => {
        // Initialize ads only if they haven't been initialized yet
        if (!isAdInitialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdInitialized.current = true;
        }
      }
    );
  }, []);

  return (
    <div className='container mx-auto p-4 my-2'>
      <div className='w-full min-h-[200px]'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client={GOOGLE_AD_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format='auto'
          data-full-width-responsive='true'
        ></ins>
      </div>
    </div>
  );
}
