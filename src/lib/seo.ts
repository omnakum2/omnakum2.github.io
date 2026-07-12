import { SITE, DEFAULT_OG_IMAGE, SITE_TITLE_SUFFIX } from '../consts';
import type { SeoConfig } from '../types/seo';

export function buildSeo(config: SeoConfig) {
  let cleanCanonical = config.canonical;
  // Ensure trailing slash for paths without file extensions
  if (!cleanCanonical.match(/\.[a-z0-9]+$/i) && !cleanCanonical.endsWith('/')) {
    cleanCanonical += '/';
  }
  
  const canonicalUrl = new URL(cleanCanonical, SITE.url).toString();
  const fullTitle = config.title.includes(SITE.name) ? config.title : `${config.title}${SITE_TITLE_SUFFIX}`;

  return {
    title: config.title,
    fullTitle: fullTitle,
    description: config.description,
    canonical: canonicalUrl,
    ogTitle: config.ogTitle ?? config.title,
    ogDescription: config.ogDescription ?? config.description,
    ogImage: new URL(config.ogImage ?? DEFAULT_OG_IMAGE, SITE.url).toString(),
    keywords: config.keywords,
    jsonLd: config.jsonLd,
  };
}
