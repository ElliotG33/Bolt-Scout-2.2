import './globals.css';
import { Inter, Lexend } from 'next/font/google';
import Script from 'next/script';
import AuthProvider from '@/providers/AuthProvider';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { Viewport } from 'next';
// import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata = {
  title: 'Scout AI - The Power of Scalable Micro Influence',
  description:
    'Scout AI helps businesses discover and engage in relevant online discussions across social media platforms.',
};

// Define the viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel='icon' href='/favicon.png' />
      </head>
      <body className={`${inter.variable} ${lexend.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        {/* <Script
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9770704114610149'
          strategy='afterInteractive'
          crossOrigin='anonymous'
        /> */}

        {/* Google Analytics Script */}
        <Script
          id='gtag-script'
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-FNNQBNFJG5'
        />
        <Script
          id='gtag-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FNNQBNFJG5');
            `,
          }}
        />
      </body>
    </html>
  );
}
