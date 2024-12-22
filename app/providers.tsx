'use client';

import { SessionProvider } from 'next-auth/react';

// Custom provider to wrap our app with the NextAuth SessionProvider
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
