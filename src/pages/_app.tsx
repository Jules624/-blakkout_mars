import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';

import '@/styles/globals.css';
import SEO_CONFIG from '@/lib/seo-config';
import { EasterEggProvider } from '@/context/EasterEggContext';

import { TerminalButton } from '@/components/ui/TerminalButton';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO_CONFIG} />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <EasterEggProvider>
          <div className="noise-bg min-h-screen">
            <div className="crt-scan-line" />
            <Component {...pageProps} />
    
            <TerminalButton />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0a0a0a',
                  color: '#fff',
                  border: '1px solid #333',
                },
              }}
            />
          </div>
        </EasterEggProvider>
      </ThemeProvider>
    </>
  );
}