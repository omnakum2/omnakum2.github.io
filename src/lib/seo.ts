import { SITE, DEFAULT_OG_IMAGE } from '../consts';
import type { SeoConfig } from '../types/seo';

export function resolveSeo(config: SeoConfig) {
  const canonicalUrl = new URL(config.canonical, SITE.url).toString();
  return {
    title: config.title,
    description: config.description,
    canonical: canonicalUrl,
    openGraph: {
      basic: {
        title: config.title,
        type: 'website',
        image: new URL(DEFAULT_OG_IMAGE, SITE.url).toString(),
        url: canonicalUrl,
      },
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  };
}
