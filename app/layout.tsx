import './globals.css';
import { Inter, Lexend } from 'next/font/google';
import { cookies } from 'next/headers';
import { NextAuthProvider } from './providers';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
// import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata = {
  title: 'Scout AI - The Power of Scalable Micro Influence',
  description:
    'Scout AI helps businesses discover and engage in relevant online discussions across social media platforms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value.trim();
  const isLoggedIn = !!token;

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-sans`}>
        <NextAuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header isLoggedIn={isLoggedIn} />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
