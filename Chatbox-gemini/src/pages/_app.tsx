import React from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * Custom App component that wraps all pages with
 * an error boundary, authentication provider, and other global providers if needed.
 */
const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </SessionProvider>
  );
};

export default MyApp;
