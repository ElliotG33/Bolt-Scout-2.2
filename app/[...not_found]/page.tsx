'use client';

import { useEffect, useState } from 'react';

export default function NotFound() {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1);
      } else {
        window.location.href = '/';
        clearTimeout(timerId);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='font-lexend text-3xl font-bold tracking-tight mb-3'>
        404 - Page Not Found
      </h1>
      <p>Redirecting to homepage in {timeLeft} seconds...</p>
    </div>
  );
}
