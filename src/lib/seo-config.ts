import { DefaultSeoProps } from 'next-seo';

const SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: '%s | @blakkout_mars',
  defaultTitle: '@blakkout_mars | Collectif Techno & Geek Marseillais',
  description: 'Collectif marseillais organisateur d\'événements immersifs mêlant culture techno et univers geek. Découvrez nos soirées, notre univers et notre merchandising exclusif.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://blakkout-mars.fr',
    siteName: '@blakkout_mars',
    images: [
      {
        url: 'https://blakkout-mars.fr/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '@blakkout_mars - Collectif Techno & Geek Marseillais',
      },
    ],
  },
  twitter: {
    handle: '@blakkout_mars',
    site: '@blakkout_mars',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  additionalMetaTags: [
    {
      name: 'theme-color',
      content: '#0a0a0a',
    },
    {
      name: 'keywords',
      content: 'blakkout, marseille, techno, geek, événements, soirées, collectif, immersif, hacking, glitch',
    },
  ],
};

export default SEO_CONFIG;