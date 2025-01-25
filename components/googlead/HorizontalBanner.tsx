'use client';

import { useEffect, useRef } from 'react';

interface HorizontalBannerProps {
  slot?: string;
}

const GOOGLE_AD_CLIENT_ID = 'ca-pub-9770704114610149';

export default function HorizontalBanner({
  slot = '5657566101',
}: HorizontalBannerProps) {
  const isAdInitialized = useRef(false);
  const adContainerRef = useRef<HTMLDivElement>(null); // Ref for the ad container

  // Function to set the height based on screen size
  const setAdContainerHeight = () => {
    if (adContainerRef.current) {
      if (window.innerWidth < 768) {
        adContainerRef.current.style.height = '90px'; // Mobile height
        adContainerRef.current.style.width = '100%';
      } else {
        adContainerRef.current.style.height = '200px'; // Larger devices height
        adContainerRef.current.style.width = '100%';
      }
    }
  };

  useEffect(() => {
    // Initialize Google Ads (only once per instance)
    if (!isAdInitialized.current) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdInitialized.current = true;
    }

    // Set initial height based on screen size
    setAdContainerHeight();

    // Set up MutationObserver to handle dynamic height changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          adContainerRef.current &&
          adContainerRef.current.style.height === 'auto'
        ) {
          setAdContainerHeight(); // Reset height if Google Ads sets it to "auto"
        }
      });
    });

    // Observe changes to the ad container
    if (adContainerRef.current) {
      observer.observe(adContainerRef.current, {
        attributes: true, // Watch for attribute changes
        attributeFilter: ['style'], // Only watch for style changes
      });
    }

    // Add resize event listener to handle window resizing
    window.addEventListener('resize', setAdContainerHeight);

    // Cleanup observer and resize event listener on component unmount
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', setAdContainerHeight);
    };
  }, []);

  return (
    <div className='container mx-auto p-4 my-2'>
      <div
        ref={adContainerRef}
        className='google-ad-container w-full overflow-hidden'
      >
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
