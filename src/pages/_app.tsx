import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';

import '@/styles/globals.css';
import SEO_CONFIG from '@/lib/seo-config';
import { EasterEggProvider } from '@/context/EasterEggContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO_CONFIG} />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <EasterEggProvider>
          <div className="noise-bg min-h-screen">
            <div className="crt-scan-line" />
            <Component {...pageProps} />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  color: '#00ff00',
                  border: '1px solid #00ff00',
                  fontFamily: '"Space Mono", monospace',
                },
                success: {
                  iconTheme: {
                    primary: '#00ff00',
                    secondary: '#000',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff0000',
                    secondary: '#000',
                  },
                },
              }}
            />
          </div>
        </EasterEggProvider>
      </ThemeProvider>
    </>
  );
}