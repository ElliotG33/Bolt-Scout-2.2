import { useEffect } from 'react';

export default function HorizontalBanner() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div className='container mx-auto p-4 my-2'>
      <div className='p-8 rounded-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <ins
              className='adsbygoogle'
              style={{ display: 'block' }}
              data-ad-client='ca-pub-9770704114610149'
              data-ad-slot='5657566101'
              data-ad-format='auto'
              data-full-width-responsive='true'
            ></ins>
          </div>
        </div>
      </div>
    </div>
  );
}
