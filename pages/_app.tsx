import { useState } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CityProvider } from '@/context/CityContext';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CityProvider>
          <Component {...pageProps} />
        </CityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
