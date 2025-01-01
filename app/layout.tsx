import './globals.css';
import { Inter, Lexend } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';

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
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lexend.variable} font-sans`}
      >
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
      </body>
    </html>
  );
}
