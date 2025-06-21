import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Polices Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=VT323&display=swap" 
          rel="stylesheet"
        />
        {/* Meta tags supplémentaires */}
        <meta name="application-name" content="@blakkout_mars" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <body className="bg-blakkout-background font-mono text-blakkout-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}