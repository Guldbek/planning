import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import {
  QueryClient,
  QueryClientProvider,
  ReactQueryDeveloper,
} from '@tanstack/react-query';
import '~/styles/globals.css';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <QueryClientProvider client={queryClient}>
        <DefaultLayout>{page}</DefaultLayout>
      </QueryClientProvider>
    ));

  return getLayout(<Component {...pageProps} />);
}) as AppType;

export default MyApp;
