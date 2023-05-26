import '../styles/globals.css';
import type { AppProps } from 'next/app';
import createCache from '@emotion/cache';
import { SessionProvider } from 'next-auth/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { CacheProvider } from '@emotion/react';

const clientSideEmotionCache = createCache({ key: 'css' });

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache: any }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
