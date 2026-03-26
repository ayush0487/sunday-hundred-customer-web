import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUserEmail } from '@/lib/auth';

import '../styles/globals.css';

const PUBLIC_PATHS = new Set(['/', '/login', '/signup', '/404']);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isPublicRoute = useMemo(() => PUBLIC_PATHS.has(router.pathname), [router.pathname]);

  useEffect(() => {
    const checkAuth = (path?: string) => {
      const pathname = (path ?? router.pathname).split('?')[0];
      const isPublic = PUBLIC_PATHS.has(pathname);

      if (isPublic) {
        setAuthChecked(true);
        return;
      }

      const loggedIn = Boolean(getCurrentUserEmail());
      setIsLoggedIn(loggedIn);
      setAuthChecked(true);

      if (!loggedIn) {
        router.replace('/login');
      }
    };

    checkAuth();

    const onRouteChangeComplete = (url: string) => {
      checkAuth(url);
    };

    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {isPublicRoute || (authChecked && isLoggedIn) ? <Component {...pageProps} /> : null}
    </ThemeProvider>
  );
}

export default MyApp;
