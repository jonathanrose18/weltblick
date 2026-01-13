import { Geist, Geist_Mono } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useReportWebVitals } from 'next/web-vitals';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import '@/shared/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useReportWebVitals(vitals => console.log('Vitals: ', vitals));

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <main
      className={cn(
        geistSans.className,
        geistMono.variable,
        'h-screen overflow-y-auto tracking-tight antialiased dark:via-zinc-900 dark:from-black dark:to-black dark:bg-linear-to-b bg-linear-to-b from-white via-zinc-200 to-white'
      )}
    >
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>
      </ThemeProvider>
    </main>
  );
}
